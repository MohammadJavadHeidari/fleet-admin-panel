import 'src/global.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SnackbarProvider } from 'src/components/snackbar';

import { AuthConsumer } from 'src/auth/context';
import { AuthProvider as AdminAuthProvider } from 'src/auth/context/admin';
import { AuthProvider as DriverAuthProvider } from 'src/auth/context/driver';
import { AuthProvider as EmployeeAuthProvider } from 'src/auth/context/employee';

import { usePathname } from './routes/hooks';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

// Create a client
const queryClient = new QueryClient();

export default function App({ children }: AppProps) {
  useScrollToTop();

  const pathname = usePathname();

  const isAdmin = pathname.includes('/admin');
  const isDriver = pathname.includes('/driver');
  const isEmployee = pathname.includes('/employee');

  const AuthProvider = isAdmin
    ? AdminAuthProvider
    : isDriver
      ? DriverAuthProvider
      : isEmployee
        ? EmployeeAuthProvider
        : null;

  if (!AuthProvider) {
    throw new Error('AuthProvider not found');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <AuthConsumer>{children}</AuthConsumer>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
