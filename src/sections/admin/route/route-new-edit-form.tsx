import type { IRoute } from 'src/types/route';
import type { IStationList } from 'src/types/station';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useWatch, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';
import { NeshanAPI } from 'src/utils/neshan-api';

import { Iconify } from 'src/components/iconify';
import { Map, MapMarker } from 'src/components/map';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from 'src/components/hook-form';

type Props = {
  currentRoute?: IRoute;
};

const NewRouteSchema = zod
  .object({
    name: zod.string(),
    stations: zod.array(
      zod.object({
        id: zod.string(),
        stationId: zod.string(),
      })
    ),
  })
  .required();

type FormValuesProps = zod.infer<typeof NewRouteSchema>;

const useCreateRoute = () =>
  useMutation({
    mutationFn: (data: Omit<FormValuesProps, 'stations'> & { stations: string[] }) =>
      apiClient.post(API_ENDPOINTS.route.new, data),
  });

const useGetStationList = () =>
  useQuery({
    queryKey: ['station', 'list'],
    queryFn: () => apiClient.get<IStationList>(API_ENDPOINTS.station.list),
  });

export default function RouteNewEditForm({ currentRoute }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: stationList, isLoading: isLoadingStationList } = useGetStationList();
  const { mutate: createNewRoute, isPending: isLoadingCreateRoute } = useCreateRoute();

  const defaultValues = useMemo(
    () => ({
      name: currentRoute?.name || '',
      stations: [
        { id: '', stationId: '' },
        { id: '', stationId: '' },
      ],
    }),
    [currentRoute]
  );

  const method = useForm<FormValuesProps>({
    resolver: zodResolver(NewRouteSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = method;

  const { fields, insert, remove } = useFieldArray({
    control,
    name: 'stations',
  });

  const watchedStations = useWatch({
    control,
    name: 'stations',
  });

  if (isLoadingStationList) return <LoadingScreen />;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const parsedData = {
        ...data,
        stations: data.stations.map((station) => station.stationId),
      };

      createNewRoute(parsedData, {
        onSuccess: () => {
          enqueueSnackbar('مسیر با موفقیت ثبت شد');
          reset();
          router.push(paths.admin.dashboard.route.list);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const stations = stationList?.results.data || [];

  const getFilteredOptions = (currentIndex: number) => {
    if (!stations.length) return stations;

    const selectedStationIds = watchedStations
      .map((station, index) => (index !== currentIndex ? station.stationId : null))
      .filter(Boolean);

    return stations.filter((station) => !selectedStationIds.includes(station.id));
  };

  const renderFirstStation = (
    <>
      {fields.slice(0, 1).map((field, index) => (
        <Stack direction="row" alignItems="center" spacing={2} key={field.id}>
          <Typography variant="h6" whiteSpace="nowrap" width="100px">
            ایستگاه اول
          </Typography>
          <RHFAutocomplete
            fullWidth
            name={`stations.${index}.stationId`}
            label="ایستگاه ها"
            options={getFilteredOptions(index).map((station) => station.id)}
            getOptionLabel={(option) => {
              if (!option) return '';

              const { name, address } = stations.find((station) => station.id === option)!;

              return `${name} - ${address}`;
            }}
            isOptionEqualToValue={(option, value) => option === value}
            renderOption={(props, option) => {
              const { name, address } = stations.find((station) => station.id === option)!;

              return (
                <li {...props} key={name}>
                  {name} ({address})
                </li>
              );
            }}
          />
        </Stack>
      ))}
    </>
  );

  const renderLastStation = (
    <>
      {fields.slice(-1).map((field, index) => {
        const actualIndex = fields.length - 1;
        return (
          <Stack direction="row" alignItems="center" spacing={2} key={field.id}>
            <Typography variant="h6" whiteSpace="nowrap" width="100px">
              ایستگاه آخر
            </Typography>
            <RHFAutocomplete
              fullWidth
              name={`stations.${actualIndex}.stationId`}
              label="ایستگاه ها"
              options={getFilteredOptions(actualIndex).map((station) => station.id)}
              getOptionLabel={(option) => {
                if (!option) return '';

                const { name, address } = stations.find((station) => station.id === option)!;

                return `${name} - ${address}`;
              }}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { name, address } = stations.find((station) => station.id === option)!;

                return (
                  <li {...props} key={name}>
                    {name} ({address})
                  </li>
                );
              }}
            />
          </Stack>
        );
      })}
    </>
  );

  const renderMiddleStations = (
    <>
      {fields.slice(1, -1).map((field, index) => {
        const actualIndex = index + 1;

        return (
          <Stack direction="row" alignItems="center" spacing={2} key={field.id}>
            <Box sx={{ width: '100px' }}>
              <Typography variant="h6" whiteSpace="nowrap">
                ایستگاه {index + 2}
              </Typography>
            </Box>
            <RHFAutocomplete
              fullWidth
              name={`stations.${actualIndex}.stationId`}
              label="ایستگاه ها"
              options={getFilteredOptions(actualIndex).map((station) => station.id)}
              getOptionLabel={(option) => {
                if (!option) return '';

                const { name, address } = stations.find((station) => station.id === option)!;

                return `${name} - ${address}`;
              }}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { name, address } = stations.find((station) => station.id === option)!;

                return (
                  <li {...props} key={name}>
                    {name} ({address})
                  </li>
                );
              }}
            />

            <IconButton onClick={() => remove(actualIndex)}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Stack>
        );
      })}

      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ width: '100px' }} />
        <Button
          variant="outlined"
          fullWidth
          color="primary"
          onClick={() => insert(1, { id: '', stationId: '' })}
        >
          افزودن ایستگاه
        </Button>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={method} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="name" label="نام مسیر" />

          {renderFirstStation}
          {renderMiddleStations}
          {renderLastStation}

          <Stack spacing={3} mt={3} direction="row" justifyContent="flex-end">
            <Button
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting || isLoadingCreateRoute}
            >
              {currentRoute ? 'ویرایش مسیر' : 'ایجاد مسیر'}
            </Button>

            <Button
              component={RouterLink}
              href={paths.admin.dashboard.route.list}
              type="button"
              variant="outlined"
              size="large"
            >
              انصراف
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  );
}
