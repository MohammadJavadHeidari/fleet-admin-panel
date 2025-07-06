import type { IStation } from 'src/types/station';
import type { INeshanCoordinates } from 'src/types/neshan';
import type SDKMap from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';
import { NeshanAPI } from 'src/utils/neshan-api';

import { Map, MapMarker } from 'src/components/map';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

type Props = {
  currentStation?: IStation;
};

const NewStationSchema = zod.object({
  name: zod.string().min(1, 'نام ایستگاه اجباری است'),
  address: zod.string().min(1, 'آدرس ایستگاه اجباری است'),
  isActive: zod.boolean(),
  lat: zod.number(),
  lng: zod.number(),
});

type NewStationFormValues = zod.infer<typeof NewStationSchema>;

const useGetReverseGeocoding = (coordinates: INeshanCoordinates) =>
  useQuery({
    queryKey: ['reverse-geocoding', coordinates],
    queryFn: () => NeshanAPI.reverseGeocode(coordinates),
    enabled: !!coordinates.lat && !!coordinates.lng,
  });

const useCreateStation = () =>
  useMutation({
    mutationFn: (data: NewStationFormValues) => apiClient.post(API_ENDPOINTS.station.new, data),
  });

export default function StationNewEditForm({ currentStation }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  const { data: reverseGeocoding, isLoading: isReverseGeocodingLoading } =
    useGetReverseGeocoding(coordinates);

  const { mutate: createStation, isPending: isCreatingStation } = useCreateStation();

  const defaultValues = useMemo(
    () => ({
      name: currentStation?.name || '',
      address: currentStation?.address || '',
      code: currentStation?.code || '',
      isActive: currentStation?.isActive || true,
      lat: currentStation?.lat || 0,
      lng: currentStation?.lng || 0,
    }),
    [currentStation]
  );

  const method = useForm<NewStationFormValues>({
    resolver: zodResolver(NewStationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = method;

  useEffect(() => {
    if (!reverseGeocoding) return;

    setValue('address', reverseGeocoding.formatted_address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reverseGeocoding]);

  const onSubmit = async (data: NewStationFormValues) => {
    try {
      createStation(data, {
        onSuccess: () => {
          reset();
          enqueueSnackbar(currentStation ? 'ویرایش ایستگاه با موفقیت انجام شد' : 'ایجاد ایستگاه با موفقیت انجام شد');
          router.push(paths.dashboard.station.list);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCoordinatesChange = ({ lat, lng }: INeshanCoordinates) => {
    setCoordinates({ lat, lng });
    setValue('lat', lat);
    setValue('lng', lng);
  };

  const mapSetter = (map: SDKMap) => {
    map.on('load', () => {
      const center = map.getCenter();
      handleCoordinatesChange({ lat: center.lat, lng: center.lng });
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      handleCoordinatesChange({ lat: center.lat, lng: center.lng });
    });
  };

  const renderDetails = (
    <Grid size={5}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField name="name" label="نام ایستگاه" />

          <RHFTextField
            name="address"
            label="آدرس ایستگاه"
            slotProps={{
              input: {
                endAdornment: isReverseGeocodingLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null,
              },
            }}
          />

          <RHFSwitch name="isActive" label="وضعیت" />
        </Stack>
      </Card>

      <Stack spacing={3} mt={3} direction="row">
        <Button
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isCreatingStation}
        >
          {currentStation ? 'ویرایش ایستگاه' : 'ایجاد ایستگاه'}
        </Button>

        <Button
          component={RouterLink}
          href={paths.dashboard.station.list}
          type="button"
          variant="outlined"
          size="large"
        >
          انصراف
        </Button>
      </Stack>
    </Grid>
  );

  const renderAddress = (
    <Grid size={7}>
      <Card
        sx={{
          height: 500,
        }}
      >
        <Map mapSetter={mapSetter} />
        <MapMarker />
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={method} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        {renderDetails}

        {renderAddress}
      </Grid>
    </FormProvider>
  );
}
