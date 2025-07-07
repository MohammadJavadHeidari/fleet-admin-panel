// ----------------------------------------------------------------------

const ADMIN = {
  DASHBOARD: '/admin/dashboard',
  AUTH: '/admin/auth',
};

const DRIVER = {
  DASHBOARD: '/driver/dashboard',
  AUTH: '/driver/auth',
};

const EMPLOYEE = {
  DASHBOARD: '/employee/dashboard',
  AUTH: '/employee/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  admin: {
    auth: {
      signIn: `${ADMIN.AUTH}/sign-in`,
    },
    dashboard: {
      root: ADMIN.DASHBOARD,
      employee: {
        root: `${ADMIN.DASHBOARD}/employee`,
        list: `${ADMIN.DASHBOARD}/employee/list`,
        new: `${ADMIN.DASHBOARD}/employee/new`,
      },
      driver: {
        root: `${ADMIN.DASHBOARD}/driver`,
        list: `${ADMIN.DASHBOARD}/driver/list`,
        new: `${ADMIN.DASHBOARD}/driver/new`,
      },
      station: {
        root: `${ADMIN.DASHBOARD}/station`,
        list: `${ADMIN.DASHBOARD}/station/list`,
        new: `${ADMIN.DASHBOARD}/station/new`,
      },
      route: {
        root: `${ADMIN.DASHBOARD}/route`,
        list: `${ADMIN.DASHBOARD}/route/list`,
        new: `${ADMIN.DASHBOARD}/route/new`,
      },
    },
  },
  driver: {
    auth: {
      requestOtp: `${DRIVER.AUTH}/otp/request`,
      verifyOtp: `${DRIVER.AUTH}/otp/verify`,
    },
    dashboard: {
      root: DRIVER.DASHBOARD,
    },
  },
  employee: {
    auth: {
      requestOtp: `${EMPLOYEE.AUTH}/otp/request`,
      verifyOtp: `${EMPLOYEE.AUTH}/otp/verify`,
    },
    dashboard: {
      root: EMPLOYEE.DASHBOARD,
    },
  },
};
