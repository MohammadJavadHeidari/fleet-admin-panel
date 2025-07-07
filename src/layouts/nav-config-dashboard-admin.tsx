import { paths } from 'src/routes/paths';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'داشبورد',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'کارمندان',
    path: paths.admin.dashboard.employee.list,
    icon: icon('ic-user'),
  },
  {
    title: 'رانندگان',
    path: paths.admin.dashboard.driver.list,
    icon: icon('ic-driver'),
  },
  {
    title: 'ایستگاه ها',
    path: paths.admin.dashboard.station.list,
    icon: icon('ic-station'),
  },
  {
    title: 'مسیر ها',
    path: paths.admin.dashboard.route.list,
    icon: icon('ic-route'),
  },
];
