import { CONFIG } from 'src/config-global';

import { MapView } from 'src/sections/driver/map/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`داشبورد - ${CONFIG.appName}`}</title>

      <MapView />
    </>
  );
}
