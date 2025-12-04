import React, { useEffect, useMemo, useState } from 'react';
import offices from '../../../office-floorplans/assets/floorplans/offices.json';
import { buildFloorplanSrc } from '../../lib/floorplan/assets';
import { Legend } from './Legend';
import { useFilters } from '../../lib/filters/context';
import * as Tooltip from '@radix-ui/react-tooltip';
import { readBookings, onBookingsChanged, type Booking } from '../../lib/storage/bookings';
import { useRoster } from '../../lib/roster/context';
import { availabilityColors, hotspotFills } from '../../lib/style/tokens';

export type DeskStatus = 'free' | 'booked' | 'selected';

export type DeskMeta = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type DeskWithStatus = DeskMeta & {
  status: DeskStatus;
  bookedBy?: string;
};

const deskStatusColor: Record<DeskStatus, string> = {
  free: hotspotFills.free,
  booked: hotspotFills.booked,
  selected: hotspotFills.selected,
};

const statusLabel: Record<DeskStatus, string> = {
  free: 'Free',
  booked: 'Booked',
  selected: 'Selected',
};

// Orientation-specific tuning for hotspot size. Adjust here if vertical overlays need tightening/loosening.
const HOTSPOT_SCALE = {
  horizontal: { w: 1, h: 1 },
  vertical: { w: 0.8, h: 1.35 },
};

const HOTSPOT_OFFSET = {
  vertical: { x: -0.5, y: -0.55 },
};

const getDesksFor = (
  officeId: string,
  floorId: string,
): { desks: DeskMeta[]; warnings: string[]; layout?: { width: number; height: number } } => {
  const warnings: string[] = [];
  const office = (offices.offices ?? []).find((o: any) => o.id === officeId);
  const floor = office?.floors?.find((f: any) => f.id === floorId);
  if (!floor) return { desks: [], warnings: [] };

  const desks: DeskMeta[] = [];
  (floor.desks ?? []).forEach((desk: any, idx: number) => {
    const id = String(desk.id ?? `desk-${idx}`);
    const x = Number(desk.position?.x ?? NaN);
    const y = Number(desk.position?.y ?? NaN);
    const width = Number(desk.size?.width ?? NaN);
    const height = Number(desk.size?.height ?? NaN);
    const rotation = Number(desk.rotation ?? 0);
    const valid = [x, y, width, height].every((n) => Number.isFinite(n));
    const inBounds = x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= 1 && y + height <= 1;

    if (!valid || !inBounds) {
      warnings.push(`Skipping desk ${id}: invalid or out-of-bounds coordinates (${x}, ${y}, ${width}, ${height})`);
      return;
    }

    desks.push({ id, x, y, width, height, rotation });
  });

  return { desks, warnings, layout: floor.layout };
};

const deriveStatuses = (
  desks: DeskMeta[],
  bookings: Booking[],
  office: string,
  floor: string,
  date: string,
  usersById: Map<string, string>,
  selectedDeskId?: string,
): DeskWithStatus[] => {
  const activeBookings = bookings.filter((b) => b.office === office && b.floor === floor && b.date === date);
  const bookingByDesk = new Map<string, Booking>();
  activeBookings.forEach((b) => bookingByDesk.set(b.deskId, b));

  return desks.map((desk) => {
    const booking = bookingByDesk.get(desk.id);
    const status: DeskStatus = selectedDeskId === desk.id ? 'selected' : booking ? 'booked' : 'free';
    const bookedBy = booking ? usersById.get(booking.userId) : undefined;
    return { ...desk, status, bookedBy };
  });
};

type FloorplanViewProps = {
  selectedDeskId?: string;
  onDeskSelect?: (deskId: string) => void;
  onFreeDeskClick?: (deskId: string) => void;
  onBookedDeskClick?: (deskId: string) => void;
};

export const FloorplanView: React.FC<FloorplanViewProps> = ({ selectedDeskId, onDeskSelect, onFreeDeskClick, onBookedDeskClick }) => {
  const { state } = useFilters();
  const { users } = useRoster();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [imageError, setImageError] = useState(false);
  const [hoveredDeskId, setHoveredDeskId] = useState<string | undefined>();

  useEffect(() => {
    const initial = readBookings();
    if (initial.ok) setBookings(initial.data);
    const unsubscribe = onBookingsChanged((next) => setBookings(next));
    return unsubscribe;
  }, []);

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u.name])), [users]);

  const { desks, warnings, layout } = useMemo(() => getDesksFor(state.office, state.floor), [state.office, state.floor]);

  useEffect(() => {
    warnings.forEach((msg) => console.warn(msg));
  }, [warnings]);

  const effectiveSelection = selectedDeskId ?? hoveredDeskId;

  const desksWithStatus = useMemo(
    () => deriveStatuses(desks, bookings, state.office, state.floor, state.date, usersById, effectiveSelection),
    [desks, bookings, state.office, state.floor, state.date, usersById, effectiveSelection],
  );

  const counts = useMemo(() => {
    return desksWithStatus.reduce(
      (acc, desk) => {
        acc[desk.status] += 1;
        return acc;
      },
      { free: 0, booked: 0, selected: 0 } as Record<DeskStatus, number>,
    );
  }, [desksWithStatus]);

  const src = buildFloorplanSrc(state.office, state.floor);
  const aspectRatio = layout?.width && layout?.height ? `${layout.width} / ${layout.height}` : undefined;

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const labelForDesk = (desk: DeskWithStatus) => {
    const base = `Desk ${desk.id}`;
    if (desk.status === 'booked' && desk.bookedBy) return `${base} — Booked by ${desk.bookedBy}`;
    if (desk.status === 'booked') return `${base} — Booked`;
    if (desk.status === 'selected') return `${base} — Selected`;
    return `${base} — Free`;
  };

  return (
    <section className="card" aria-label="Floorplan with hotspots">
      <Tooltip.Provider delayDuration={0}>
        <div className="floorplan" style={aspectRatio ? { aspectRatio } : undefined}>
          <img
            src={src}
            alt={`${state.office} ${state.floor} floorplan`}
            className="floorplan-img"
            style={aspectRatio ? { aspectRatio, objectFit: 'fill' } : undefined}
            onError={() => {
              console.error(`Missing floorplan asset for ${state.office} ${state.floor}: ${src}`);
              setImageError(true);
            }}
          />
          {imageError && (
            <div className="floorplan-fallback" role="alert">
              Floorplan image unavailable for {state.office} / {state.floor}
            </div>
          )}
          <div className="overlay">
            {desksWithStatus.map((desk) => (
              <Tooltip.Root key={desk.id} delayDuration={0}>
                <Tooltip.Trigger asChild>
              <button
                className="hotspot"
                data-status={desk.status}
                style={{
                  left: `${(() => {
                    const isVertical = desk.rotation % 180 !== 0;
                    const renderedW = isVertical
                      ? desk.height * HOTSPOT_SCALE.vertical.w
                      : desk.width * HOTSPOT_SCALE.horizontal.w;
                    const offsetX = isVertical ? (renderedW - desk.width) * HOTSPOT_OFFSET.vertical.x : 0;
                    return (desk.x + offsetX) * 100;
                  })()}%`,
                  top: `${(() => {
                    const isVertical = desk.rotation % 180 !== 0;
                    const renderedH = isVertical
                      ? desk.width * HOTSPOT_SCALE.vertical.h
                      : desk.height * HOTSPOT_SCALE.horizontal.h;
                    const offsetY = isVertical ? (renderedH - desk.height) * HOTSPOT_OFFSET.vertical.y : 0;
                    return (desk.y + offsetY) * 100;
                  })()}%`,
                  width: `${(() => {
                    const isVertical = desk.rotation % 180 !== 0;
                    return (isVertical
                      ? desk.height * HOTSPOT_SCALE.vertical.w
                      : desk.width * HOTSPOT_SCALE.horizontal.w) * 100;
                  })()}%`,
                  height: `${(() => {
                    const isVertical = desk.rotation % 180 !== 0;
                    return (isVertical
                      ? desk.width * HOTSPOT_SCALE.vertical.h
                      : desk.height * HOTSPOT_SCALE.horizontal.h) * 100;
                  })()}%`,
                  backgroundColor: deskStatusColor[desk.status],
                  borderColor: desk.status === 'booked' ? availabilityColors.booked : availabilityColors.selected,
                }}
                aria-label={labelForDesk(desk)}
                    onFocus={() => {
                      setHoveredDeskId(desk.id);
                      onDeskSelect?.(desk.id);
                    }}
                    onBlur={() => setHoveredDeskId(undefined)}
                    onMouseEnter={() => {
                      setHoveredDeskId(desk.id);
                      onDeskSelect?.(desk.id);
                    }}
                    onMouseLeave={() => setHoveredDeskId(undefined)}
                    onClick={() => {
                      if (desk.status === 'free') onFreeDeskClick?.(desk.id);
                      if (desk.status === 'booked') onBookedDeskClick?.(desk.id);
                    }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content side="top" className="tooltip">
                  {labelForDesk(desk)}
                  <Tooltip.Arrow className="tooltip-arrow" />
                </Tooltip.Content>
              </Tooltip.Root>
            ))}
          </div>
        </div>
        <Legend counts={counts} />
      </Tooltip.Provider>
    </section>
  );
};
