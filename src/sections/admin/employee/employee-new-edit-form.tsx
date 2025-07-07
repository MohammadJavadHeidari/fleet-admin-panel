import type { IEmployee } from 'src/types/employee';
import type { IStationList } from 'src/types/station';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { API_ENDPOINTS } from 'src/utils/axios';
import { apiClient } from 'src/utils/api-client';

import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

type Props = {
  currentEmployee?: IEmployee;
};

const NewEmployeeSchema = zod.object({
  firstName: zod.string().min(1, 'نام اجباری است'),
  lastName: zod.string().min(1, 'نام خانوادگی اجباری است'),
  phoneNumber: zod.string().min(1, 'شماره تلفن اجباری است'),
  email: zod.string().min(1, 'ایمیل اجباری است'),
  password: zod.string().min(1, 'رمز عبور اجباری است'),
  stationId: zod.string().min(1, 'ایستگاه اجباری است'),
});

type NewEmployeeFormValues = zod.infer<typeof NewEmployeeSchema>;

const useCreateEmployee = () =>
  useMutation({
    mutationFn: (data: NewEmployeeFormValues) => apiClient.post(API_ENDPOINTS.admin.employee.new, data),
  });

const useGetStationList = () =>
  useQuery({
    queryKey: ['station', 'list'],
    queryFn: () => apiClient.get<IStationList>(API_ENDPOINTS.admin.station.list),
  });

export default function EmployeeNewEditForm({ currentEmployee }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: stationList, isLoading: isLoadingStationList } = useGetStationList();
  const { mutate: createEmployee, isPending: isCreatingEmployee } = useCreateEmployee();

  const defaultValues = useMemo(
    () => ({
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      phoneNumber: currentEmployee?.phoneNumber || '',
      email: currentEmployee?.email || '',
      password: currentEmployee?.password || '',
      stationId: currentEmployee?.station.id || '',
    }),
    [currentEmployee]
  );

  const method = useForm<NewEmployeeFormValues>({
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues,
  });

  if (isLoadingStationList) return <LoadingScreen />;

  const stations = stationList?.results.data || [];

  const onSubmit = async (data: NewEmployeeFormValues) => {
    try {
      createEmployee(data, {
        onSuccess: () => {
          enqueueSnackbar('کارمند با موفقیت ایجاد شد', { variant: 'success' });
          router.push(paths.admin.dashboard.employee.list);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;

  return (
    <FormProvider methods={method} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFTextField name="firstName" label="نام" />
          <RHFTextField name="lastName" label="نام خانوادگی" />
          <RHFTextField name="phoneNumber" label="شماره تلفن" />
          <RHFTextField name="email" label="ایمیل" />
          <RHFTextField name="password" label="رمز عبور" />

          <RHFAutocomplete
            name="stationId"
            label="ایستگاه"
            options={stations.map((station) => station.id)}
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
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" loading={isSubmitting || isCreatingEmployee}>
            {!currentEmployee ? 'ایجاد کارمند' : 'ذخیره تغغیرات'}
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  );
}
