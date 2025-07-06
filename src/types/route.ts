import type { IStation } from './station';

export type IRoute = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  stations: IStation[];
};

export type IRouteList = {
  data: IRoute[];
  total: number;
};
