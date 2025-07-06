// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '',
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
    root: '/',
    employee: `${ROOTS.DASHBOARD}/employee`,
    station: {
      root: `${ROOTS.DASHBOARD}/station`,
      list: `${ROOTS.DASHBOARD}/station/list`,
      new: `${ROOTS.DASHBOARD}/station/new`,
    },
    route: {
      root: `${ROOTS.DASHBOARD}/route`,
      list: `${ROOTS.DASHBOARD}/route/list`,
      new: `${ROOTS.DASHBOARD}/route/new`,
    },
  },
};
