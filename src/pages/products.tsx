import { CONFIG } from 'src/config-global';

import { ProductsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`محصولات - ${CONFIG.appName}`}</title>

      <ProductsView />
    </>
  );
}
