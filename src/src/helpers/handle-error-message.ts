import get from 'lodash.get';
import type { ErrorResponse } from './saga';
import { HttpStatusCode } from '../enums';
import { BusinessExceptionCode } from '../exceptions';
export function handleErrorMessage(error: any): ErrorResponse {
  const response = get(error, 'response', null);

  if (response) {
    const status = get(response, 'status', -1);
    const message = get(response, 'message', '');
    if (status === HttpStatusCode.UNAUTHORIZED) {
      if (
        response?.headers?.['www-authenticate']?.includes('The token expired')
      ) {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message,
          status: BusinessExceptionCode.EXP_TOKEN,
        };
      } else {
        return {
          code: HttpStatusCode.UNAUTHORIZED,
          message,
          status: BusinessExceptionCode.UNAUTHORIZED,
        };
      }
    }

    if (message) {
      return {
        code: status,
        message: message,
        status: getExceiptionCode(status),
      };
    }

    return {
      code: status,
      message: 'Error occurred. Please try again.',
      status: getExceiptionCode(status),
    };
  } else {
    if (error && typeof error === 'object') {
      const status = get(error, 'status', -1);
      const message = get(error, 'message', '');
      const code = get(error, 'code', HttpStatusCode.BAD_REQUEST);

      if (status === HttpStatusCode.UNAUTHORIZED) {
        if (
          response?.headers?.['www-authenticate']?.includes('The token expired')
        ) {
          return {
            code: status,
            message,
            status: BusinessExceptionCode.EXP_TOKEN,
          };
        } else {
          return {
            code: status,
            message,
            status: BusinessExceptionCode.UNAUTHORIZED,
          };
        }
      }

      if (message) {
        return {
          code: code,
          message: message,
          status: getExceiptionCode(status),
        };
      }

      return {
        code: code,
        message: 'Error occurred. Please try again.',
        status: getExceiptionCode(status),
      };
    }

    return {
      code: HttpStatusCode.BAD_REQUEST,
      message: 'Error occurred. Please try again.',
      status: getExceiptionCode(HttpStatusCode.BAD_REQUEST),
    };
  }
}

export function getExceiptionCode(statusCode: number): BusinessExceptionCode {
  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      return BusinessExceptionCode.UNAUTHORIZED;
    case HttpStatusCode.REQUEST_TIMEOUT:
      return BusinessExceptionCode.REQUEST_TIME_OUT;
    default:
      return BusinessExceptionCode.UNEXPECTED_ERROR;
  }
}
