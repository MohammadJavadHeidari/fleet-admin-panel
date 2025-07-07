import { paths } from './routes/paths';
import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  admin: {
    auth: {
      pathAfterLogin: string;
    };
  };
  driver: {
    auth: {
      pathAfterLogin: string;
    };
  };
  employee: {
    auth: {
      pathAfterLogin: string;
    };
  };
};

export const CONFIG: ConfigValue = {
  appName: 'پنل مدیریت',
  appVersion: packageJson.version,
  admin: {
    auth: {
      pathAfterLogin: paths.admin.dashboard.root,
    },
  },
  driver: {
    auth: {
      pathAfterLogin: paths.driver.dashboard.root,
    },
  },
  employee: {
    auth: {
      pathAfterLogin: paths.employee.dashboard.root,
    },
  },
};
