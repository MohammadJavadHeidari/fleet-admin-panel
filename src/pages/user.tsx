import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`کاربران - ${CONFIG.appName}`}</title>

      <UserView />
    </>
  );
}
