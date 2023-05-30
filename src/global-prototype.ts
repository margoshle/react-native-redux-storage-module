import type { ErrorResponse } from './lib/index';

declare global {
  /**
   * Custom handle error message
   * */
  var ___handleErrorMessage: ((error: any) => ErrorResponse) | undefined;
}
