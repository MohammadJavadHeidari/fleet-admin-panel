import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const OtpRequestSchema = zod.object({
  phoneNumber: zod.string().min(11, 'شماره موبایل الزامی میباشد'),
});

type OtpRequestFormValues = zod.infer<typeof OtpRequestSchema>;

export function OtpRequestView() {
  const { requestOtp } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const searchParams = useSearchParams();

  const methods = useForm<OtpRequestFormValues>({
    resolver: zodResolver(OtpRequestSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: OtpRequestFormValues) => {
    try {
      await requestOtp?.(data.phoneNumber);

      enqueueSnackbar('کد تایید با موفقیت ارسال شد', { variant: 'success' });

      searchParams.set('phoneNumber', data.phoneNumber);

      window.location.href = paths.employee.auth.verifyOtp + `?${searchParams.toString()}`;
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : 'خطایی رخ داده است');
    }
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {!!errorMsg && (
        <Alert sx={{ width: '100%', mb: 3 }} severity="error">
          {errorMsg}
        </Alert>
      )}

      <RHFTextField name="phoneNumber" label="شماره موبایل" sx={{ mb: 3 }} />
      <Button
        size="large"
        type="submit"
        variant="contained"
        sx={{ borderRadius: '50%', width: 50, height: 50, minWidth: 40 }}
        loading={isSubmitting}
      >
        <Iconify width={20} height={20} icon="eva:arrow-ios-back-fill" />
      </Button>
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mb: 5,
        }}
      >
        <Typography variant="h3">خوش آمدید!</Typography>
        <Typography variant="body1">
          لطفاً شماره‌‌ٔ موبایلتان را وارد کنید تا بتوانیم با شما در ارتباط باشیم.
        </Typography>
      </Box>
      {renderForm}
    </FormProvider>
  );
}
