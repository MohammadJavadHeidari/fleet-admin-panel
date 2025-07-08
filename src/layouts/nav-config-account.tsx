import { Iconify } from 'src/components/iconify';

import { paths } from '../routes/paths';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'خانه',
    href: paths.admin.dashboard.root,
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
];
