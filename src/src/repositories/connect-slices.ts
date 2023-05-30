import { PayloadAction, Slice, createSlice } from '@reduxjs/toolkit';
import { AppState, AppStateStatus } from 'react-native';

interface IConnectState {
  isConnected: boolean | null;
  appState: AppStateStatus | null;
}

type IConnectSlice = Slice<
  IConnectState,
  {
    setConnected: (
      state: IConnectState,
      action: PayloadAction<boolean | null>
    ) => IConnectState | undefined;
    setAppState: (
      state: IConnectState,
      action: PayloadAction<AppStateStatus | null>
    ) => IConnectState | undefined;
  },
  string
>;

const initialState: IConnectState = {
  isConnected: true,
  appState: AppState.isAvailable ? AppState.currentState : null,
};

class ConnectRepository {
  private static sliceName = 'connect';
  private static _instance?: ConnectRepository;
  static instance(initial?: () => IConnectSlice): ConnectRepository {
    if (!ConnectRepository._instance) {
      ConnectRepository._instance = new ConnectRepository(initial);
    }
    return ConnectRepository._instance;
  }
  private _slices: IConnectSlice | undefined;
  constructor(initial?: () => IConnectSlice) {
    if (!initial) {
      this.initialize();
    } else {
      this._slices = initial();
    }
  }

  private initialize() {
    this._slices = createSlice({
      name: ConnectRepository.sliceName,
      initialState,
      reducers: {
        setConnected: (
          state: IConnectState,
          action: PayloadAction<boolean | null>
        ) => {
          return {
            ...state,
            isConnected: action?.payload,
          };
        },
        setAppState: (
          state: IConnectState,
          action: PayloadAction<AppStateStatus | null>
        ) => {
          return {
            ...state,
            appState: action?.payload,
          };
        },
      },
    });
  }

  get reducer() {
    return this._slices!.reducer;
  }
  get actions() {
    return this._slices!.actions;
  }
  get slice() {
    return this._slices;
  }
}

const connectRepo = ConnectRepository.instance();
export { ConnectRepository, connectRepo, IConnectState, IConnectSlice };
