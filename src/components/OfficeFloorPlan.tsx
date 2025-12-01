import React, { useMemo } from "react";
import officesData from "../../assets/floorplans/offices.json";

export type Desk = {
  id: string;
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zone: string;
  features: string[];
};

export type Fixture = {
  id: string;
  label: string;
  type: "wall" | "meeting-room" | "kitchen" | "restroom" | "reception" | string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  color?: string;
};

export type Floor = {
  id: string;
  name: string;
  level: number;
  layout: { width: number; height: number };
  desks: Desk[];
  fixtures?: Fixture[];
};

export type Office = {
  id: string;
  name: string;
  code: string;
  floors: Floor[];
};

export type OfficesData = {
  offices: Office[];
};

type OfficeFloorPlanProps = {
  officeId: string;
  floorId: string;
  svgWidth?: number;
  svgHeight?: number;
};

const data: OfficesData = officesData as OfficesData;

const wrapLabel = (text: string, maxWidth: number, fontSize: number, maxLines = 2) => {
  const approxCharWidth = fontSize * 0.6;
  const maxChars = Math.max(3, Math.floor(maxWidth / approxCharWidth));
  if (text.length <= maxChars) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  return lines.slice(0, maxLines);
};

export const zoneColors: Record<string, string> = {
  Engineering: "#90caf9",
  Product: "#a5d6a7",
  Sales: "#ffcc80",
  Hotdesks: "#cfd8dc",
  Exec: "#f48fb1",
  Collaboration: "#ffe082",
};

const fixtureColors: Record<string, string> = {
  wall: "#b0bec5",
  "meeting-room": "#e0f7fa",
  kitchen: "#fff3e0",
  restroom: "#ede7f6",
  reception: "#f3e5f5",
  phonebooth: "#ede7f6",
  plant: "#c8e6c9",
  storage: "#e0e0e0",
};

const labeledFixtureTypes = new Set([
  "meeting-room",
  "kitchen",
  "restroom",
  "reception",
  "phonebooth",
  "game-table",
  "foosball",
  "arcade",
  "slide",
]);

export const OfficeFloorPlan: React.FC<OfficeFloorPlanProps> = ({
  officeId,
  floorId,
  svgWidth = 800,
  svgHeight = 600,
}) => {
  const office = useMemo(
    () => data.offices.find((o) => o.id === officeId),
    [officeId]
  );

  const floor = useMemo(
    () => office?.floors.find((f) => f.id === floorId),
    [office, floorId]
  );

  if (!office) {
    return <div>Office not found.</div>;
  }

  if (!floor) {
    return <div>Floor not found.</div>;
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      aria-label={`${office.name} ${floor.name} floor plan`}
      style={{ border: "1px solid #e0e0e0", background: "#fafafa" }}
    >
      {(floor.fixtures ?? []).map((fixture) => {
        const x = fixture.position.x * svgWidth;
        const y = fixture.position.y * svgHeight;
        const fixtureWidth = fixture.size.width * svgWidth;
        const fixtureHeight = fixture.size.height * svgHeight;
        const centerX = x + fixtureWidth / 2;
        const centerY = y + fixtureHeight / 2;
        const fill = fixture.color ?? fixtureColors[fixture.type] ?? "#e0e0e0";
        const fixtureFont = Math.min(
          12,
          Math.max(8, Math.min(fixtureWidth, fixtureHeight) * 0.25)
        );
        const fixtureLines = wrapLabel(
          fixture.label,
          fixtureWidth - 6,
          fixtureFont,
          3
        );

        return (
          <g
            key={fixture.id}
            transform={`rotate(${fixture.rotation} ${centerX} ${centerY})`}
          >
            <rect
              x={x}
              y={y}
              width={fixtureWidth}
              height={fixtureHeight}
              fill={fill}
              fillOpacity={0.7}
              stroke="#9e9e9e"
              strokeWidth={1.5}
              rx={8}
              ry={8}
            >
              <title>{`${fixture.label} (${fixture.type})`}</title>
            </rect>
            {labeledFixtureTypes.has(fixture.type) && (
              <text
                x={centerX}
                y={centerY - ((fixtureLines.length - 1) * fixtureFont) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fixtureFont}
                fill="#37474f"
                transform={`rotate(${-fixture.rotation} ${centerX} ${centerY})`}
                style={{ pointerEvents: "none" }}
              >
                {fixtureLines.map((line, idx) => (
                  <tspan key={idx} x={centerX} dy={idx === 0 ? 0 : fixtureFont}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}

      {floor.desks.map((desk) => {
        const x = desk.position.x * svgWidth;
        const y = desk.position.y * svgHeight;
        const deskWidth = desk.size.width * svgWidth;
        const deskHeight = desk.size.height * svgHeight;
        const centerX = x + deskWidth / 2;
        const centerY = y + deskHeight / 2;
        const fill = zoneColors[desk.zone] ?? "#cfd8dc";
        const textFontSize = Math.min(
          12,
          Math.max(7, Math.min(deskWidth, deskHeight) * 0.4)
        );
        const textLines = wrapLabel(
          desk.label,
          Math.min(deskWidth, deskHeight) - 4,
          textFontSize,
          2
        );

        return (
          <g
            key={desk.id}
            transform={`rotate(${desk.rotation} ${centerX} ${centerY})`}
          >
            <rect
              x={x}
              y={y}
              width={deskWidth}
              height={deskHeight}
              fill={fill}
              stroke="#455a64"
              strokeWidth={1.2}
              rx={4}
              ry={4}
            >
              <title>{`${desk.label} – ${desk.zone}`}</title>
            </rect>
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={textFontSize}
              fill="#263238"
              transform={`rotate(${-desk.rotation} ${centerX} ${centerY})`}
              style={{ pointerEvents: "none" }}
            >
              {textLines.map((line, idx) => (
                <tspan key={idx} x={centerX} dy={idx === 0 ? 0 : textFontSize}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default OfficeFloorPlan;
