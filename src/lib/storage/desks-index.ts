import officesJson from '../../../office-floorplans/assets/floorplans/offices.json';

export type DeskIndex = Record<string, { office: string; floor: string }>;

let cache: DeskIndex | null = null;

export const getDeskIndex = (): DeskIndex => {
  if (cache) return cache;
  const index: DeskIndex = {};
  (officesJson.offices ?? []).forEach((office: any) => {
    const officeId = String(office.id);
    (office.floors ?? []).forEach((floor: any) => {
      const floorId = String(floor.id);
      (floor.desks ?? []).forEach((desk: any) => {
        if (desk?.id) {
          index[String(desk.id)] = { office: officeId, floor: floorId };
        }
      });
    });
  });
  cache = index;
  return index;
};
