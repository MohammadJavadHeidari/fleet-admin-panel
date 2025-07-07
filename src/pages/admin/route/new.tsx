import { CONFIG } from 'src/config-global';

import { RouteCreateView } from 'src/sections/admin/route/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ایجاد مسیر جدید - ${CONFIG.appName}`}</title>

      <RouteCreateView />
    </>
  );
}
