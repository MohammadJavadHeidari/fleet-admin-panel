
// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '/',
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    employee: `${ROOTS.DASHBOARD}/employee`,
  },
};
