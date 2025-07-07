import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import { mergeClasses } from 'minimal-shared/utils';

import Container from '@mui/material/Container';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type AuthMobileContentProps = ContainerProps & {
  layoutQuery?: Breakpoint;
  disablePadding?: boolean;
};

export function AuthMobileContent({
  sx,
  children,
  className,
  disablePadding,
  maxWidth = 'sm',
  layoutQuery = 'sm',
  ...other
}: AuthMobileContentProps) {
  return (
    <Container
      className={mergeClasses([layoutClasses.content, className])}
      maxWidth="sm"
      sx={[
        (theme) => ({
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 'var(--layout-dashboard-content-pt)',
          pb: 'var(--layout-dashboard-content-pb)',
          bgcolor: theme.vars.palette.background.default,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Container>
  );
}
