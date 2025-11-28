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

export type Floor = {
  id: string;
  name: string;
  level: number;
  layout: { width: number; height: number };
  desks: Desk[];
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
      {floor.desks.map((desk) => {
        const x = desk.position.x * svgWidth;
        const y = desk.position.y * svgHeight;
        const deskWidth = desk.size.width * svgWidth;
        const deskHeight = desk.size.height * svgHeight;
        const centerX = x + deskWidth / 2;
        const centerY = y + deskHeight / 2;

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
              fill="#cfd8dc"
              stroke="#607d8b"
              strokeWidth={1}
              rx={4}
              ry={4}
            >
              <title>
                {desk.label} – {desk.zone}
              </title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
};

export default OfficeFloorPlan;
