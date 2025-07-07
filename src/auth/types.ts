// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

export type OtpVerifyParams = {
  phoneNumber: string;
  code: string;
};

// ----------------------------------------------------------------------
export type AuthContextType = {
  user: AuthUserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login?: (email: string, password: string) => Promise<void>;
  // OTP for login driver and employee
  requestOtp?: (phoneNumber: string) => Promise<void>;
  verifyOtp?: (phoneNumber: string, otp: string) => Promise<void>;
  //
  logout: () => Promise<void>;
};
