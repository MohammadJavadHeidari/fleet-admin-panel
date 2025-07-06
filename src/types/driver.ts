import type { IRoute } from './route';

export type IDriver = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId: string;
  address: string;
  comment: string;
  licensePlateTwoDigit: number;
  licensePlateLetter: string;
  licensePlateThreeDigit: number;
  licensePlateProvince: number;
  carBrand: string;
  carColor: string;
  carProductionDate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  route: IRoute;
};

export type IDriverList = {
  data: IDriver[];
  total: number;
};
