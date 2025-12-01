import React, { useEffect, useMemo, useState } from "react";
import OfficeFloorPlan, {
  Office,
  OfficesData,
  zoneColors,
} from "../components/OfficeFloorPlan";
import officesJson from "../../assets/floorplans/offices.json";

const officesData = officesJson as OfficesData;
const offices: Office[] = officesData.offices;

const fixtureTypeLabels: { key: string; label: string; color: string }[] = [
  { key: "wall", label: "Walls/Partitions", color: "#b0bec5" },
  { key: "meeting-room", label: "Meeting/Board Rooms", color: "#e0f7fa" },
  { key: "kitchen", label: "Kitchen/Breakout", color: "#fff3e0" },
  { key: "restroom", label: "Restrooms", color: "#ede7f6" },
  { key: "reception", label: "Reception", color: "#f3e5f5" },
  { key: "phonebooth", label: "Phone Booths", color: "#ede7f6" },
  { key: "plant", label: "Planters", color: "#c8e6c9" },
  { key: "storage", label: "Storage/Supplies", color: "#e0e0e0" },
  { key: "printer", label: "Printers", color: "#eeeeee" },
  { key: "game-table", label: "Table Tennis", color: "#e1bee7" },
  { key: "foosball", label: "Foosball", color: "#bbdefb" },
  { key: "arcade", label: "Arcade", color: "#ffecb3" },
  { key: "slide", label: "Slide", color: "#ffe0b2" }
];

const DemoFloorplans: React.FC = () => {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(
    offices[0]?.id ?? ""
  );
  const [selectedFloorId, setSelectedFloorId] = useState<string>(
    offices[0]?.floors[0]?.id ?? ""
  );

  const selectedOffice = useMemo(
    () => offices.find((office) => office.id === selectedOfficeId),
    [selectedOfficeId]
  );

  const floorOptions = useMemo(
    () => selectedOffice?.floors ?? [],
    [selectedOffice]
  );

  useEffect(() => {
    if (!floorOptions.find((floor) => floor.id === selectedFloorId)) {
      setSelectedFloorId(floorOptions[0]?.id ?? "");
    }
  }, [floorOptions, selectedFloorId]);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Office Floorplans</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid #e0e0e0",
            padding: "1rem",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="office-select" style={{ display: "block" }}>
              Office
            </label>
            <select
              id="office-select"
              value={selectedOfficeId}
              onChange={(event) => setSelectedOfficeId(event.target.value)}
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.25rem" }}
            >
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="floor-select" style={{ display: "block" }}>
              Floor
            </label>
            <select
              id="floor-select"
              value={selectedFloorId}
              onChange={(event) => setSelectedFloorId(event.target.value)}
              style={{ width: "100%", padding: "0.4rem", marginTop: "0.25rem" }}
            >
              {floorOptions.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          {selectedOffice && selectedFloorId ? (
            <OfficeFloorPlan
              officeId={selectedOffice.id}
              floorId={selectedFloorId}
            />
          ) : (
            <div>Select an office and floor to view the plan.</div>
          )}
          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.4rem 1rem" }}>
            <strong style={{ gridColumn: "1 / -1" }}>Desk Zones</strong>
            {Object.entries(zoneColors).map(([zone, color]) => (
              <div key={zone} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    background: color,
                    border: "1px solid #607d8b",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ fontSize: "0.9rem" }}>{zone}</span>
              </div>
            ))}
            <strong style={{ gridColumn: "1 / -1", marginTop: "0.4rem" }}>Fixtures</strong>
            {fixtureTypeLabels.map((item) => (
              <div key={item.key} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    background: item.color,
                    border: "1px solid #607d8b",
                    borderRadius: "2px",
                  }}
                />
                <span style={{ fontSize: "0.9rem" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoFloorplans;
