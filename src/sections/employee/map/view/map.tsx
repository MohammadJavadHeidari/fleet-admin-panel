import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';

import type { SDKMap } from 'src/components/map';
import type { IDriverLocation } from 'src/types/employee';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useEffect } from 'react';
import { Popup, Marker } from '@neshan-maps-platform/mapbox-gl';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';
import { RotatedMarker } from 'src/utils/rotated-marker';

import { MobileContent } from 'src/layouts/mobile';
import { getCurrentLocationAsync } from 'src/hooks';

import { Map } from 'src/components/map';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const useGetDriverLocation = () =>
  useQuery({
    queryKey: ['employee', 'dashboard', 'driver', 'location'],
    queryFn: () => apiClient.get<IDriverLocation>(API_ENDPOINTS.employee.driver.location),
    gcTime: 0,
    staleTime: 0,
    retry: 5,
    refetchInterval: 10000,
  });

export function MapView() {
  const mapRef = useRef<SDKMap | null>(null);

  const [employeeLocationStatus, setEmployeeLocationStatus] = useState<
    'unknown' | 'loading' | 'success'
  >('unknown');

  const { data: driverLocation, isLoading: isDriverLocationLoading } = useGetDriverLocation();

  const mapSetter = (map: SDKMap) => {
    mapRef.current = map;

    map.on('load', () => {
      map.resize();
    });
  };

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

  useEffect(() => {
    if (isDriverLocationLoading) return;

    const { lat, lng } = driverLocation?.results.driverLocation ?? {};

    if (!lat || !lng) return;

    const popupText = new Popup({ offset: 25 }).setText('مکان راننده');

    new RotatedMarker({
      rotation: 100,
      popup: 'مکان راننده',
    })
      .setLngLat([lng, lat])
      .setPopup(popupText)
      .addTo(mapRef.current!);
  }, [isDriverLocationLoading, driverLocation]);

  const handleLocationButton = async () => {
    setEmployeeLocationStatus('loading');

    const currentLocation = await getCurrentLocationAsync();

    const popupText = new Popup({ offset: 25 }).setText('مکان شما');

    new Marker()
      .setPopup(popupText)
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .addTo(mapRef.current!);

    mapRef.current?.setCenter([currentLocation.longitude, currentLocation.latitude]);
    mapRef.current?.setZoom(13);

    setEmployeeLocationStatus('success');
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
      {employeeLocationStatus === 'unknown' ? (
        <Box sx={{ width: 30, height: 30 }}>
          <img src="/assets/icons/ic-location-unknown.png" alt="location" />
        </Box>
      ) : employeeLocationStatus === 'loading' ? (
        <CircularProgress />
      ) : (
        <Iconify width={26} icon="material-symbols:my-location-rounded" />
      )}
    </Fab>
  );

  return (
    <MobileContent>
      <Map
        style={{
          height: '100vh',
          position: 'relative',
        }}
        mapSetter={mapSetter}
      />
      {locationButton}
    </MobileContent>
  );
}
