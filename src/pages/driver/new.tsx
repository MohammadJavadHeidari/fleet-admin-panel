import { CONFIG } from 'src/config-global';

import { DriverCreateView } from 'src/sections/driver/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ایجاد راننده جدید - ${CONFIG.appName}`}</title>

      <DriverCreateView />
    </>
  );
}
