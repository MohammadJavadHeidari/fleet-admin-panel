import type SDKMap from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';
import type { MapComponentProps } from '@neshan-maps-platform/mapbox-gl-react/dist/Types';

import { MapComponent } from '@neshan-maps-platform/mapbox-gl-react';

export const Map = ({ ...other }: Omit<MapComponentProps, 'options'>) => (
  <MapComponent
    id="map"
    options={{
      mapKey: 'web.dd11c077f9e948beb9c0e23d5b6260bb',
      mapType: 'neshanVector',
      mapTypeControllerOptions: {
        show: false,
      },
      zoom: 13,
      center: [59.605936719447655, 36.29804508848799],
    }}
    style={{
        height: '100vh',
        position: 'relative',
    }}
    {...other}
  />
);


export type { SDKMap };