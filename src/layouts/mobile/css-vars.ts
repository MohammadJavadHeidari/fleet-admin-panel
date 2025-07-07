import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function mobileLayoutVars(theme: Theme) {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-vertical-width': '300px',
    '--layout-mobile-content-pt': theme.spacing(1),
    '--layout-mobile-content-pb': theme.spacing(8),
    '--layout-mobile-content-px': theme.spacing(5),
  };
}
