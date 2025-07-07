import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { API_ENDPOINTS } from 'src/utils/axios';

import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from '../utils';

import type { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  REQUEST_OTP = 'REQUEST_OTP',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.REQUEST_OTP]: {
    phoneNumber: string;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REQUEST_OTP) {
    return {
      ...state,
      user: {
        ...state.user,
        phoneNumber: action.payload.phoneNumber,
      },
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'driverAccessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(STORAGE_KEY, accessToken);

        const response = await axios.get(API_ENDPOINTS.driver.auth.me);

        const {
          data: { ...user },
        } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // REQUEST OTP
  const requestOtp = useCallback(async (phoneNumber: string) => {
    const data = { phoneNumber };

    const response = await axios.post(API_ENDPOINTS.driver.auth.requestOtp, data);

    console.log({ requestOtp: response.data });

    dispatch({
      type: Types.REQUEST_OTP,
      payload: {
        phoneNumber,
      },
    });
  }, []);

  // VERIFY OTP

  const verifyOtp = useCallback(async (phoneNumber: string, otp: string) => {
    const data = { phoneNumber, otp };

    const response = await axios.post(API_ENDPOINTS.driver.auth.verifyOtp, data);

    const {
      success,
      message,
      data: { accessToken, ...user },
    } = response.data;

    if (!success) {
      throw new Error(message);
    }

    setSession(STORAGE_KEY, accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(STORAGE_KEY, null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      requestOtp,
      verifyOtp,
      logout,
    }),
    [requestOtp, verifyOtp, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
