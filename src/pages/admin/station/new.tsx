import { CONFIG } from 'src/config-global';

import { StationCreateView } from 'src/sections/admin/station/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ایجاد ایستگاه جدید - ${CONFIG.appName}`}</title>

      <StationCreateView />
    </>
  );
}
