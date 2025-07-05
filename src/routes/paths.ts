
// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '/',
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    employee: `${ROOTS.DASHBOARD}/employee`,
  },
};
