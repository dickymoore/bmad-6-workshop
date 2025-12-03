export type FilterState = {
  office: string;
  floor: string;
  date: string; // YYYY-MM-DD local
};

export type FilterOptions = {
  offices: { id: string; name: string }[];
  floors: { id: string; name: string }[];
};
