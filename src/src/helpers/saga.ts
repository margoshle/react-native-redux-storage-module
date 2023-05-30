import { put, select } from 'redux-saga/effects';
import { BusinessExceptionCode } from '../exceptions';
import type { RootState } from '../storage';
import { IConnectState, loadingRepo } from '../repositories';
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../enums';
import { handleErrorMessage } from './handle-error-message';
type ReturnToNext = true | undefined;

export interface ErrorResponse {
  code: number | string;
  message: string;
  status: BusinessExceptionCode | undefined;
}

export interface ISagaOptions {
  execution: () => Generator<any, any, ReturnToNext>;
  handleError:
    | ((err: ErrorResponse) => void | Promise<void> | undefined)
    | undefined;
  showDialog?: boolean;
  preAction: {
    type: string;
    payload: any;
  };
  isShowMessageError?: boolean;
}

export function* invoke(options: ISagaOptions) {
  const {
    execution,
    handleError,
    showDialog,
    preAction,
    isShowMessageError = true,
  } = options;
  try {
    const connect: IConnectState = yield select(
      (state: RootState) => state!.connect
    );

    const { isConnected = false } = connect || {};

    yield put(loadingRepo.actions.onFetching(preAction.type));

    /**
     * check connect to internet
     * */
    if (!isConnected) {
      DeviceEventEmitter.emit(EventKeys.LOST_CONNECT);
      return;
    }

    if (showDialog) {
      yield put(loadingRepo.actions.showLoading(preAction.type));
    }

    yield* execution();

    yield put(loadingRepo.actions.nonFetching(preAction.type));

    if (showDialog) {
      yield put(loadingRepo.actions.hideLoading(preAction.type));
    }
  } catch (error: any) {
    if (__DEV__) {
      console.info(`Saga Invoke Error [${preAction.type}]>>>>>`, { error });
    }
    yield put(loadingRepo.actions.nonFetching(preAction.type));

    if (showDialog) {
      yield put(loadingRepo.actions.hideLoading(preAction.type));
    }

    const errorMessage: ErrorResponse = global.___handleErrorMessage
      ? global.___handleErrorMessage(error)
      : handleErrorMessage(error);

    if (
      errorMessage &&
      errorMessage.status === BusinessExceptionCode.UNEXPECTED_ERROR
    ) {
      DeviceEventEmitter.emit(EventKeys.UNEXPECTED_ERROR, {
        error: errorMessage,
      });
      return;
    }

    if (
      errorMessage &&
      errorMessage.status === BusinessExceptionCode.EXP_TOKEN
    ) {
      DeviceEventEmitter.emit(EventKeys.EXP_TOKEN, {
        error: errorMessage,
      });
      return;
    }

    // if refresh token is expired or not valid -> logout
    if (
      errorMessage.code === 401 &&
      errorMessage.status === BusinessExceptionCode.UNAUTHORIZED
    ) {
      DeviceEventEmitter.emit(EventKeys.LOGOUT, {
        error: errorMessage,
      });
      return;
    }
    if (!isShowMessageError) {
      return;
    }

    if (typeof handleError === 'function') {
      yield handleError(errorMessage);
    } else if (errorMessage.code === 'ERR_NETWORK') {
      DeviceEventEmitter.emit(EventKeys.LOST_CONNECT);
    } else {
      DeviceEventEmitter.emit(EventKeys.SHOW_MESSAGE_ERROR, {
        error: errorMessage,
      });
    }
  }
}
