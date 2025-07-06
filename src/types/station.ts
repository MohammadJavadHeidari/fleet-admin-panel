export type IStation = {
  id: string;
  name: string;
  code: string;
  address: string;
  lat: number;
  lng: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IStationList = {
  data: IStation[];
  total: number;
};
