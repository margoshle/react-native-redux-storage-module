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

class ReduxStorageEventListenerImpl {
  private static _instance?: ReduxStorageEventListenerImpl;
  static instance(): ReduxStorageEventListenerImpl {
    if (!ReduxStorageEventListenerImpl._instance) {
      ReduxStorageEventListenerImpl._instance =
        new ReduxStorageEventListenerImpl();
    }
    return ReduxStorageEventListenerImpl._instance;
  }
  private _events: Array<EmitterSubscription> = [];
  constructor() {}

  registerEvent(events: IEventListener) {
    if (typeof events !== 'object') {
      return;
    }

    Object.keys(events).forEach((e) => {
      const subscriptions = DeviceEventEmitter.addListener(
        EventKeys[e as IEventKeys] as string,
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

export const ReduxStorageEventListener =
  ReduxStorageEventListenerImpl.instance();
