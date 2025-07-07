import { CONFIG } from 'src/config-global';

import { MapView } from 'src/sections/employee/map/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`داشبورد - ${CONFIG.appName}`}</title>

      <MapView />
    </>
  );
}
