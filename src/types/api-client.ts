

export type IBaseResponse<T> = {
  success: boolean
  message: string
  results: T
};
