import { createContext } from 'react';

import type { AuthContextType } from '../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as AuthContextType);

export const AuthConsumer = AuthContext.Consumer;
