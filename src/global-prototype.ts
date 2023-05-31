import type { ErrorResponse } from './src/index';

declare global {
  type IRequestAction<OtherParams extends any = never> = OtherParams & {
    /**
     *
     * Will callback data after successful fetching the api!
     * @param {(...args: any[])} args: any[]
     * @type {Function} callback
     * @returns {void}
     * @memberof IRequestAction
     */
    callback?: (...args: any[]) => void;
    /**
     *
     * Will callback data after successful fetching the api!
     * @param {(...args: any[])} args: any[]
     * @type {Function} callback
     * @returns {void}
     * @memberof IRequestAction
     */
    onSuccess?: (...args: any[]) => void;
    /**
     *
     * Will callback data error after fetching the api!
     * @param {(...args: any[])} args: any[]
     * @type {Function} callback
     * @returns {void}
     * @memberof IRequestAction
     */
    onError?: (...args: any[]) => void;
    /**
     *
     * Will show loading modal while fetching data
     * @type {boolean}
     * @return {boolean}
     * @memberof IRequestAction
     */
    showLoading?: boolean;
    /**
     *
     * an other parameter
     * @type {any}
     * @returns {any}
     * @memberof IRequestAction
     */
    [keyField: string]: any;
  };
  /**
   * Custom handle error message
   * */
  var ___handleErrorMessage: ((error: any) => ErrorResponse) | undefined;
}
