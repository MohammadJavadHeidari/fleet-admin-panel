import { paths } from './routes/paths';
import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  auth: {
    pathAfterLogin: string;
  };
};

export const CONFIG: ConfigValue = {
  appName: 'پنل مدیریت',
  appVersion: packageJson.version,
  auth: {
    pathAfterLogin: paths.dashboard.root,
  },
};
