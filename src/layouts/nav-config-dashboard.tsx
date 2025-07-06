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
    path: paths.dashboard.employee.list,
    icon: icon('ic-user'),
  },
  {
    title: 'رانندگان',
    path: paths.dashboard.driver.list,
    icon: icon('ic-driver'),
  },
  {
    title: 'ایستگاه ها',
    path: paths.dashboard.station.list,
    icon: icon('ic-station'),
  },
  {
    title: 'مسیر ها',
    path: paths.dashboard.route.list,
    icon: icon('ic-route'),
  },
];
