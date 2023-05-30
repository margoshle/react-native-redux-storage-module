import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import type { ErrorResponse } from '../helpers';
import { EventKeys } from '../enums';

/**
 * error callback function
 *
 * @param data - information error
 * */
type ICallback = (data?: ErrorResponse) => void;
/**
 * registered events type
 *
 */
type IEventKeys = keyof typeof EventKeys;
type IEventListener = {
  [P in IEventKeys]: ICallback;
};

class ReduxStorageEvetListinerImpl {
  private static _instance?: ReduxStorageEvetListinerImpl;
  static instance(): ReduxStorageEvetListinerImpl {
    if (!ReduxStorageEvetListinerImpl._instance) {
      ReduxStorageEvetListinerImpl._instance =
        new ReduxStorageEvetListinerImpl();
    }
    return ReduxStorageEvetListinerImpl._instance;
  }
  private _events: Array<EmitterSubscription> = [];
  constructor() {}

  registerEvent(events: IEventListener) {
    if (typeof events !== 'object') {
      return;
    }

    Object.keys(events).forEach((e) => {
      const subscriptions = DeviceEventEmitter.addListener(
        EventKeys[e as IEventKeys],
        events[e as IEventKeys]
      );
      this._events.push(subscriptions);
    });
  }

  destroyAll() {
    this._events.forEach((event) => {
      event.remove();
    });
  }
}

export const ReduxStorageEvetListiner = ReduxStorageEvetListinerImpl.instance();
