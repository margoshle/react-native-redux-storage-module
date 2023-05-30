import type { ErrorResponse } from './src/index';

declare global {
  /**
   * Custom handle error message
   * */
  var ___handleErrorMessage: ((error: any) => ErrorResponse) | undefined;
}
