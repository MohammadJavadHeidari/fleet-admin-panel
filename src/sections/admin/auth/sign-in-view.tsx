import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const SignInSchema = zod.object({
  email: zod.string().email('ایمیل معتبر نیست'),
  password: zod.string().min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد'),
});

type SignInFormValues = zod.infer<typeof SignInSchema>;

export function SignInView() {
  const { login } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const methods = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: SignInFormValues) => {
      try {
        await login(data.email, data.password);

        window.location.href = returnTo || CONFIG.admin.auth.pathAfterLogin;
      } catch (error) {
        console.error(error);
        setErrorMsg(error instanceof Error ? error.message : 'خطایی رخ داده است');
      }
    },
    [login, returnTo]
  );

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

      <RHFTextField
        name="email"
        label="ایمیل"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <RHFTextField
        name="password"
        label="رمز عبور"
        type={password.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
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
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">ورود</Typography>
      </Box>
      {renderForm}
    </FormProvider>
  );
}
