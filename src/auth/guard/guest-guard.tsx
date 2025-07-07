import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated } = useAuthContext();

  const app = pathname.split('/')[1];

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(paths[app as keyof typeof paths].dashboard.root);
    }
  }, [authenticated, app, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
