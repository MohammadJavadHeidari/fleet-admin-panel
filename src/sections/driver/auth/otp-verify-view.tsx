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
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const OtpVerifySchema = zod.object({
  code: zod.string().min(6, 'کد تایید باید 6 رقم باشد'),
});

type OtpVerifyFormValues = zod.infer<typeof OtpVerifySchema>;

export function OtpVerifyView() {
  const { verifyOtp } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const driverPhoneNumber = searchParams.get('phoneNumber') || '';

  const methods = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(OtpVerifySchema),
    defaultValues: {
      code: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: OtpVerifyFormValues) => {
    try {
      await verifyOtp?.(driverPhoneNumber , data.code);

      window.location.href = paths.driver.dashboard.root;
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

      <RHFCode dir='ltr' name="code" length={6} sx={{ mb: 3 }} />

      <Button fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        ورود
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
        <Typography variant="h3">کد تایید را وارد کنید</Typography>
        <Typography variant="body1">
          کد تایید را به شماره {driverPhoneNumber} ارسال کردیم.
        </Typography>

        <Typography variant="body1" sx={{ mt: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
          شماره موبایل اشتباه است؟ 
          <RouterLink href={`${paths.driver.auth.requestOtp}`}>
            <Typography variant="body1" component="span" sx={{ textDecoration: 'underline' }}>
              ویرایش
            </Typography>
          </RouterLink> 
        </Typography>
      </Box>
      {renderForm}
    </FormProvider>
  );
}
