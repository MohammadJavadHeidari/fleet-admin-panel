import type { IDriver } from 'src/types/driver';
import type { IRouteList } from 'src/types/route';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';

import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewDriverSchema = zod.object({
  // PERSONAL INFO -------------------------------------
  firstName: zod.string().min(1, { message: 'نام راننده اجباری است' }),
  lastName: zod.string().min(1, { message: 'نام خانوادگی راننده اجباری است' }),
  phoneNumber: zod.string().min(1, { message: 'شماره تلفن راننده اجباری است' }),
  address: zod.string(),
  nationalId: zod.string().min(1, { message: 'کد ملی راننده اجباری است' }),
  comment: zod.string(),
  isActive: zod.boolean(),
  // CAR INFO -------------------------------------
  carBrand: zod.string().min(1, { message: 'برند خودرو اجباری است' }),
  carColor: zod.string().min(1, { message: 'رنگ خودرو اجباری است' }),
  carProductionDate: zod.number().min(1, { message: 'سال ساخت خودرو اجباری است' }),

  licensePlateTwoDigit: zod.number().min(1, { message: 'دو رقم اول پلاک اجباری است' }),
  licensePlateLetter: zod.string().min(1, { message: 'حرف پلاک اجباری است' }),
  licensePlateThreeDigit: zod.number().min(1, { message: 'سه رقم آخر پلاک اجباری است' }),
  licensePlateProvince: zod.number().min(1, { message: 'استان پلاک اجباری است' }),
  // ROUTE INFO -------------------------------------
  routeId: zod.string().min(1, { message: 'مسیر اجباری است' }),
});

type NewDriverFormValues = zod.infer<typeof NewDriverSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentDriver?: IDriver;
};

const useCreateDriver = () =>
  useMutation({
    mutationFn: (data: NewDriverFormValues) => apiClient.post(API_ENDPOINTS.driver.new, data),
  });

const useGetRouteList = () =>
  useQuery({
    queryKey: ['route', 'list'],
    queryFn: () => apiClient.get<IRouteList>(API_ENDPOINTS.route.list),
  });

export default function DriverNewEditForm({ currentDriver }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: routes, isLoading: isLoadingRoutes } = useGetRouteList();
  const { mutate: createDriver, isPending: isCreatingDriver } = useCreateDriver();

  const defaultValues = useMemo(
    () => ({
      firstName: currentDriver?.firstName || '',
      lastName: currentDriver?.lastName || '',
      phoneNumber: currentDriver?.phoneNumber || '',
      address: currentDriver?.address || '',
      nationalId: currentDriver?.nationalId || '',
      comment: currentDriver?.comment || '',
      isActive: currentDriver?.isActive || true,
      //
      carBrand: currentDriver?.carBrand || '',
      carColor: currentDriver?.carColor || '',
      carProductionDate: currentDriver?.carProductionDate || 1404,
      //
      licensePlateTwoDigit: currentDriver?.licensePlateTwoDigit || 0,
      licensePlateLetter: currentDriver?.licensePlateLetter || '',
      licensePlateThreeDigit: currentDriver?.licensePlateThreeDigit || 0,
      licensePlateProvince: currentDriver?.licensePlateProvince || 0,
      //
      routeId: '',
    }),
    [currentDriver]
  );

  const method = useForm<NewDriverFormValues>({
    resolver: zodResolver(NewDriverSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = method;

  if (isLoadingRoutes) return <LoadingScreen />;

  const routeList = routes?.results.data || [];

  const onSubmit = async (data: NewDriverFormValues) => {
    try {
      debugger;
      createDriver(data, {
        onSuccess: () => {
          enqueueSnackbar(
            currentDriver ? 'بروزرسانی با موفقیت انجام شد!' : 'ایجاد با موفقیت انجام شد!'
          );
          reset();
          router.push(paths.admin.dashboard.driver.list);
        },
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('خطا در انجام عملیات!', { variant: 'error' });
    }
  };

  const renderDriverDetails = (
    <Card>
      <CardHeader title="اطلاعات راننده" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <RHFTextField name="firstName" label="نام" />

          <RHFTextField name="lastName" label="نام خانوادگی" />

          <RHFTextField name="phoneNumber" label="تلفن همراه" />

          <RHFTextField name="nationalId" label="کد ملی" />

          <RHFTextField name="address" label="آدرس" multiline rows={4} />
          <RHFTextField name="comment" label="توضیحات" multiline rows={4} />
        </Box>
      </Stack>
    </Card>
  );

  const renderCarDetails = (
    <Card>
      <CardHeader title="اطلاعات خودرو" subheader="" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <RHFTextField name="carBrand" label="برند خودرو" />

          <RHFTextField name="carColor" label="رنگ خودرو" />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2"> </Typography>
            <RHFTextField type="number" name="carProductionDate" label="سال ساخت خودرو" />
          </Stack>
        </Box>

        <Typography variant="subtitle2">پلاک</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <RHFTextField
            type="number"
            name="licensePlateThreeDigit"
            label="سه رقم آخر"
            placeholder="123"
          />
          <RHFTextField type="text" name="licensePlateLetter" label="حرف" placeholder="ب" />
          <RHFTextField
            type="number"
            name="licensePlateTwoDigit"
            label="دو رقم اول"
            placeholder="12"
          />
          <Typography variant="h5">-</Typography>

          <RHFTextField type="number" name="licensePlateProvince" label="استان" placeholder="12" />
        </Stack>
      </Stack>
    </Card>
  );

  const renderRouteDetails = (
    <Card>
      <CardHeader title="اطلاعات مسیر" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFAutocomplete
          name="routeId"
          label="مسیر"
          options={routeList.map((route) => route.id)}
          getOptionLabel={(option) => {
            if (!option) return '';

            const { name } = routeList.find((route) => route.id === option)!;

            return name;
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, option) => {
            const { name } = routeList.find((route) => route.id === option)!;

            return (
              <li {...props} key={name}>
                {name}
              </li>
            );
          }}
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <Stack direction="row" alignItems="center" flexGrow={1}>
        <RHFSwitch name="isActive" label="فعال" />
      </Stack>

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentDriver ? 'ایجاد راننده' : 'ذحیره تغییرات'}
      </Button>
    </Stack>
  );

  return (
    <FormProvider methods={method} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDriverDetails}

        {renderCarDetails}

        {renderRouteDetails}

        {renderActions}
      </Stack>
    </FormProvider>
  );
}
