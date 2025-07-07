import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';

import type { SDKMap } from 'src/components/map';
import type { IAssignedRoute } from 'src/types/driver';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Marker, Popup, LngLatBounds } from '@neshan-maps-platform/mapbox-gl';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';

import { MobileContent } from 'src/layouts/mobile';
import { useLocationTracker, getCurrentLocationAsync, useRouteDirection } from 'src/hooks';

import { Map } from 'src/components/map';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const useSaveDriverLocation = () =>
  useMutation({
    mutationFn: (data: { lat: number; lng: number }) =>
      apiClient.post(API_ENDPOINTS.driver.location.save, data),
  });

export function MapView() {
  const mapRef = useRef<SDKMap | null>(null);

  const mapSetter = (map: SDKMap) => {
    mapRef.current = map;

    map.on('load', () => {
      map.resize();

      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 6,
          },
        });
      }

      if (!map.getSource('route-points')) {
        map.addSource('route-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'route-points',
          type: 'circle',
          source: 'route-points',
          paint: {
            'circle-radius': 6,
            'circle-color': '#ef4444',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        });
      }
    });
  };

  const [isShiftMode, setIsShiftMode] = useState(false);

  const { getDirections, currentRoute, isLoading, error, clearRoute } = useRouteDirection();

  // Location tracker hook
  const { location, isTracking, startTracking, stopTracking } = useLocationTracker({
    intervalMs: 10000, // 10 seconds
    enableHighAccuracy: true,
  });

  const { mutate: saveDriverLocation } = useSaveDriverLocation();

  const { mutate: getAssignedRoute } = useMutation({
    mutationFn: () => apiClient.get<IAssignedRoute>(API_ENDPOINTS.driver.route.assigned),
    onSuccess: (data, variables, context) => {
      const coordinates = data.results;

      const origin = coordinates[0];
      const destination = coordinates[coordinates.length - 1];
      const wayPoints = coordinates.slice(1, -1);

      getDirections(
        [origin[1], origin[0]], // origin: [lat, lng]
        [destination[1], destination[0]], // destination: [lat, lng]
        wayPoints ? wayPoints?.map((wp: any) => [wp[1], wp[0]]) : undefined // waypoints: [[lat, lng], ...]
      );
    },
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Cleanup location tracking when component unmounts
  useEffect(
    () => () => {
      if (isTracking) {
        stopTracking();
        console.log('🛑 Location tracking stopped');
      }
    },
    [isTracking, stopTracking]
  );

  // Update map center when location changes (optional)
  useEffect(() => {
    if (location && mapRef.current) {
      if (isShiftMode) {
        saveDriverLocation({ lat: location.latitude, lng: location.longitude });
      }

      console.log('🎯 Map centered on user location');
    }
  }, [location]);

  // Update map with route data
  useEffect(() => {
    if (!isLoading && currentRoute && mapRef.current) {
      const map = mapRef.current;

      // Update route layer
      const routeSource = map.getSource('route') as any;
      if (routeSource) {
        routeSource.setData(currentRoute.routeGeoJSON);
      }

      // Update points layer
      const pointsSource = map.getSource('route-points') as any;
      if (pointsSource) {
        pointsSource.setData(currentRoute.pointsGeoJSON);
      }

      // Fit map to route bounds
      if (currentRoute.routeGeoJSON.features.length > 0) {
        const coordinates = currentRoute.routeGeoJSON.features[0].geometry.coordinates.flat();
        if (coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (bound: any, coord: any) => bound.extend(coord),
            new LngLatBounds()
          );
          map.fitBounds(bounds, { padding: 50 });
        }
      }
    }
  }, [currentRoute]);

  const handleShiftMode = () => {
    setIsShiftMode((prev) => {
      if (prev) {
        stopTracking();
        clearRoute();
      } else {
        getAssignedRoute();
        startTracking();
      }
      return !prev;
    });
  };

  const handleLocationButton = async () => {
    const currentDriverLocation = await getCurrentLocationAsync();

    const popupText = new Popup({ offset: 25 }).setText('مکان شما');

    new Marker()
      .setPopup(popupText)
      .setLngLat([currentDriverLocation.longitude, currentDriverLocation.latitude])
      .addTo(mapRef.current!);

    mapRef.current?.setCenter([currentDriverLocation.longitude, currentDriverLocation.latitude]);
    mapRef.current?.setZoom(13);
  };

  const locationButton = (
    <Fab
      size="medium"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 20,
        bottom: 20,
        width: 48,
        height: 48,
        bgcolor: 'white',
      }}
      onClick={handleLocationButton}
    >
      {isTracking ? (
        <Iconify width={26} icon="material-symbols:my-location-rounded" />
      ) : (
        <Box sx={{ width: 30, height: 30 }}>
          <img src="/assets/icons/ic-location-unknown.png" alt="location" />
        </Box>
      )}
    </Fab>
  );

  const switchShiftButton = (
    <Button
      size="medium"
      variant="contained"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 20,
        top: 20,
        width: 100,
        p: 2,
        lineHeight: 1,
      }}
      onClick={handleShiftMode}
      disabled={isLoading}
      loading={isLoading}
    >
      {isShiftMode ? 'پایان شیفت' : 'شروع شیفت'}
    </Button>
  );

  return (
    <MobileContent>
      <Map mapSetter={mapSetter} />
      {locationButton}
      {switchShiftButton}
    </MobileContent>
  );
}
