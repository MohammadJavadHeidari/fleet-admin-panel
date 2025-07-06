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
    employee: {
      root: `${ROOTS.DASHBOARD}/employee`,
      list: `${ROOTS.DASHBOARD}/employee/list`,
      new: `${ROOTS.DASHBOARD}/employee/new`,
    },
    driver: {
      root: `${ROOTS.DASHBOARD}/driver`,
      list: `${ROOTS.DASHBOARD}/driver/list`,
      new: `${ROOTS.DASHBOARD}/driver/new`,
    },
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
