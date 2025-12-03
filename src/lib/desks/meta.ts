import officesJson from '../../../office-floorplans/assets/floorplans/offices.json';

export type FloorMeta = {
  id: string;
  name: string;
  level?: number;
};

export type OfficeMeta = {
  id: string;
  name: string;
  code: string;
  floors: FloorMeta[];
};

export type DesksMeta = {
  offices: OfficeMeta[];
};

const parseMeta = (raw: any): DesksMeta => {
  const offices = Array.isArray(raw?.offices)
    ? raw.offices.map((office: any) => ({
        id: String(office.id),
        name: String(office.name ?? office.code ?? office.id),
        code: String(office.code ?? office.id),
        floors: Array.isArray(office.floors)
          ? office.floors.map((floor: any) => ({
              id: String(floor.id),
              name: String(floor.name ?? floor.id),
              level: typeof floor.level === 'number' ? floor.level : undefined,
            }))
          : [],
      }))
    : [];

  return { offices };
};

const cached: DesksMeta = parseMeta(officesJson);

export const getDesksMeta = (): DesksMeta => cached;
