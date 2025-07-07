import type { INeshanDirectionRequest } from 'src/types/neshan';
import type { ProcessedRoute } from 'src/utils/route-processor';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { NeshanAPI } from 'src/utils/neshan-api';

import { processNeshanRoute } from '../utils/route-processor';

// ----------------------------------------------------------------------

export function useRouteDirection() {
  const [currentRoute, setCurrentRoute] = useState<ProcessedRoute | null>(null);

  const directionMutation = useMutation({
    mutationFn: NeshanAPI.getDirection,
    onSuccess: (data) => {
      console.log('✅ Direction API Response');

      // Process the route data
      const processedRoute = processNeshanRoute(data);
      setCurrentRoute(processedRoute);
    },
    onError: (error) => {
      console.error('❌ Direction API Error:', error);
      setCurrentRoute(null);
    },
  });

  const getDirections = (
    origin: [number, number],
    destination: [number, number],
    waypoints?: [number, number][]
  ) => {
    const request: INeshanDirectionRequest = {
      origin: `${origin[0]},${origin[1]}`, // "lat,lng"
      destination: `${destination[0]},${destination[1]}`, // "lat,lng"
      vehicle: 'car',
      alternative: false,
      ...(waypoints?.length && {
        waypoints: waypoints.map((wp) => `${wp[0]},${wp[1]}`),
      }),
    };

    directionMutation.mutate(request);
  };

  return {
    currentRoute,
    getDirections,
    isLoading: directionMutation.isPending,
    error: directionMutation.error,
    clearRoute: () =>
      setCurrentRoute((prev) => ({
        ...prev,
        routeGeoJSON: {
          type: 'FeatureCollection',
          features: [],
        },
        pointsGeoJSON: {
          type: 'FeatureCollection',
          features: [],
        },
        totalDistance: 0,
        totalDuration: 0,
        summary: '',
      })),
  };
}
