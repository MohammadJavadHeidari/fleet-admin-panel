import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import { mergeClasses } from 'minimal-shared/utils';

import Container from '@mui/material/Container';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type MobileContentProps = ContainerProps & {
  layoutQuery?: Breakpoint;
  disablePadding?: boolean;
};

export function MobileContent({
  sx,
  children,
  className,
  disablePadding,
  maxWidth = 'sm',
  layoutQuery = 'sm',
  ...other
}: MobileContentProps) {
  return (
    <Container
      className={mergeClasses([layoutClasses.content, className])}
      maxWidth='sm'
      sx={[
        (theme) => ({
          position: 'relative',
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 'var(--layout-mobile-content-pt)',
          pb: 'var(--layout-mobile-content-pb)',
          [theme.breakpoints.up(layoutQuery)]: {
            px: 'var(--layout-mobile-content-px)',
          },
          ...(disablePadding && {
            p: {
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
              xl: 0,
            },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Container>
  );
}
