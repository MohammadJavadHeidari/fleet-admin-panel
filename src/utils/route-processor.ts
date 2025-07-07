import * as polyline from '@mapbox/polyline';

// ----------------------------------------------------------------------

export interface ProcessedRoute {
  routeGeoJSON: any;
  pointsGeoJSON: any;
  totalDistance: number;
  totalDuration: number;
  summary: string;
}

export const processNeshanRoute = (directionResponse: any): ProcessedRoute => {
  const routes = [];
  const points = [];
  let totalDistance = 0;
  let totalDuration = 0;
  let summary = '';

  for (let k = 0; k < directionResponse.routes.length; k++) {
    for (let j = 0; j < directionResponse.routes[k].legs.length; j++) {
      const leg = directionResponse.routes[k].legs[j];

      // Add leg distance and duration
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;

      // Use first leg summary
      if (!summary) {
        summary = leg.summary;
      }

      for (let i = 0; i < leg.steps.length; i++) {
        const step = leg.steps[i];
        const stepPolyline = step.polyline;
        const startLocation = step.start_location;

        // Decode polyline with precision 5
        const decodedRoute = polyline.decode(stepPolyline, 5);

        // Reverse coordinates from [lat, lng] to [lng, lat] for GeoJSON
        const reversedRoute = decodedRoute.map((coord) => coord.reverse());

        routes.push(reversedRoute);
        points.push(startLocation); // startLocation is already [lng, lat]
      }
    }
  }

  // Create GeoJSON objects
  const routeGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: routes,
        },
        properties: {
          distance: totalDistance,
          duration: totalDuration,
          summary,
        },
      },
    ],
  };

  const pointsGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: points,
        },
        properties: {},
      },
    ],
  };

  return {
    routeGeoJSON,
    pointsGeoJSON,
    totalDistance,
    totalDuration,
    summary,
  };
};
