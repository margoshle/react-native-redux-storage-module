import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Action,
  AnyAction,
  Dispatch,
  Reducer,
  Store,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  PersistConfig,
  Persistor,
  Transform,
  persistReducer,
  persistStore,
} from 'redux-persist';
import createCompressor from 'redux-persist-transform-compress';
import createSagaMiddleware from 'redux-saga';
import { ForkEffect, all, fork } from 'redux-saga/effects';
import {
  IConnectState,
  ILoadingState,
  connectRepo,
  loadingRepo,
} from '../repositories';

interface IStorage {
  reducer: Record<string, Reducer<any, AnyAction>>;
  sagas: (() => Generator<ForkEffect<never>, void, unknown>)[];
  whiteList: Array<string>;
  blackList: Array<string>;
  otherMiddlewares?: Array<any>;
}

interface IRootStateDefault {
  connect: IConnectState;
  loading: ILoadingState;
  [x: string]: any;
}

class RootStore {
  private static _instance?: RootStore;
  static instance(): RootStore {
    if (!RootStore._instance) {
      RootStore._instance = new RootStore();
    }
    return RootStore._instance;
  }
  protected whitelist: string[] = [];
  protected blacklist: string[] = [];
  private transforms: Transform<any, any, any, any>[] | undefined = [];
  private store?: Store<any, any>;
  private config: PersistConfig<any> = {
    key: 'rootStore',
    storage: AsyncStorage,
    transforms: [],
    debug: true,
    whitelist: [],
    timeout: 10000,
  };
  private sagaMiddleware = createSagaMiddleware();
  constructor() {}

  initRootStore($storeInfo: IStorage) {
    this.whitelist = $storeInfo.whiteList;
    this.blacklist = $storeInfo.blackList;
    if ($storeInfo.whiteList.length > 0) {
      const compressor = createCompressor({ whitelist: $storeInfo.whiteList });
      this.transforms?.push(compressor);
      this.config.whitelist = $storeInfo.whiteList;
    } else if ($storeInfo.blackList.length > 0) {
      const compressor = createCompressor({ blacklist: $storeInfo.blackList });
      this.transforms?.push(compressor);
      this.config.blacklist = $storeInfo.blackList;
    }
    this.config.transforms = this.transforms;
    const rootReducer = combineReducers({
      connect: connectRepo.reducer,
      loading: loadingRepo.reducer,
      ...$storeInfo.reducer,
    });

    const persistedReducer = persistReducer(this.config, rootReducer);
    let middlewares: any[] = [];

    if (process.env.NODE_ENV === 'development') {
      middlewares.push(logger);
    }

    middlewares.push(this.sagaMiddleware);

    if ($storeInfo.otherMiddlewares && $storeInfo.otherMiddlewares.length > 0) {
      middlewares.concat($storeInfo.otherMiddlewares);
    }

    this.store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(...middlewares),
    });
    function* $sagas() {
      yield all($storeInfo.sagas.map((saga) => fork(saga)));
    }
    this.sagaMiddleware.run($sagas);
  }

  getStore<S extends any, A extends Action<any> = AnyAction>():
    | Store<S & IRootStateDefault, A>
    | undefined {
    if (!this.store) {
      console.log('The store has not been initialized!');
      return undefined;
    }
    return this.store as Store<S & IRootStateDefault, A>;
  }

  getState<S extends any>(): (S & IRootStateDefault) | undefined {
    if (!this.store) {
      console.log('The store has not been initialized!');
      return undefined;
    }
    return (this.store as Store<S & IRootStateDefault, any>).getState();
  }

  dispatch<A extends Action<any> = AnyAction>(): Dispatch<A> | undefined {
    if (!this.store) {
      console.log('The store has not been initialized!');
      return;
    }

    return (this.store as Store<IRootStateDefault, A>).dispatch;
  }

  get getPersistStore(): Persistor {
    if (!this.store) {
      throw 'The store has not been initialized!';
    }
    return persistStore(this.store, {});
  }
}
export const rootStoreManager = RootStore.instance();
export type RootState<S = any> = S extends any
  ? {
      [P in keyof S]: S[P];
    } & IRootStateDefault
  : IRootStateDefault;

export type AppDispatch = typeof rootStoreManager.dispatch;
export function registerStore($storeInfo: IStorage) {
  if (!$storeInfo.reducer) {
    throw 'Error: new reducer argument must generate!';
  }

  if (rootStoreManager.getStore()) {
    console.log('The store has been initialed!');
    return;
  }

  rootStoreManager.initRootStore($storeInfo);

  // the original decorator
  function actualDecorator(_target: Object, _property: string | symbol): void {
    // do something with the stuff
    console.log('Genrated decorator register redux store');
  }

  // return the decorator
  return actualDecorator as any;
}
