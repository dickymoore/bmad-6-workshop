import React, { useEffect, useMemo, useState } from "react";
import OfficeFloorPlan, {
  Office,
  OfficesData,
} from "../components/OfficeFloorPlan";
import officesJson from "../../assets/floorplans/offices.json";

const officesData = officesJson as OfficesData;
const offices: Office[] = officesData.offices;

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
        </div>
      </div>
    </div>
  );
};

export default DemoFloorplans;
