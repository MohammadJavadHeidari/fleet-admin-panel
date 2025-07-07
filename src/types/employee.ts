import type { IStation } from './station';

export type IEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  station: IStation;
  createdAt: string;
  updatedAt: string;
};

export type IEmployeeList = {
  data: IEmployee[];
  total: number;
};

export type IDriverLocation = {
  driverLocation: {
    lat: number;
    lng: number;
  };
};
