import 'src/global.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SnackbarProvider } from 'src/components/snackbar';

import { AuthProvider, AuthConsumer } from 'src/auth/context';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

// Create a client
const queryClient = new QueryClient();

export default function App({ children }: AppProps) {
  useScrollToTop();

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
