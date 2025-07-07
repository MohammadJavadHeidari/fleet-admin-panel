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
    path: paths.driver.dashboard.root,
    icon: icon('ic-user'),
  },
  {
    title: 'رانندگان',
    path: paths.driver.dashboard.root,
    icon: icon('ic-driver'),
  },
  {
    title: 'ایستگاه ها',
    path: paths.driver.dashboard.root,
    icon: icon('ic-station'),
  },
  {
    title: 'مسیر ها',
    path: paths.driver.dashboard.root,
    icon: icon('ic-route'),
  },
];
