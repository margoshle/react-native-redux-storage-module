import { PayloadAction, Slice, createSlice } from '@reduxjs/toolkit';

type IActions = Record<string, boolean>;
type ICacheActions = Record<string, any>;

interface ILoadingState {
  loadingActions: IActions;
  fetchingActions: IActions;
  cachingActions: ICacheActions;
}

type ILoadingSlice = Slice<
  ILoadingState,
  {
    showLoading: (
      state: ILoadingState,
      action: PayloadAction<string>
    ) => ILoadingState | undefined;
    hideLoading: (
      state: ILoadingState,
      action: PayloadAction<string>
    ) => ILoadingState | undefined;
    onFetching: (
      state: ILoadingState,
      action: PayloadAction<string>
    ) => ILoadingState | undefined;
    nonFetching: (
      state: ILoadingState,
      action: PayloadAction<string>
    ) => ILoadingState | undefined;
    onCaching: (
      state: ILoadingState,
      action: PayloadAction<{ type: string; payload: any }>
    ) => ILoadingState | undefined;
  },
  string
>;

const initialState: ILoadingState = {
  loadingActions: {},
  fetchingActions: {},
  cachingActions: {},
};

class LoadingRepository {
  private static sliceName = 'loading';
  private static _instance?: LoadingRepository;
  static instance(initial?: () => ILoadingSlice): LoadingRepository {
    if (!LoadingRepository._instance) {
      LoadingRepository._instance = new LoadingRepository(initial);
    }
    return LoadingRepository._instance;
  }
  private _slices: ILoadingSlice | undefined;
  constructor(initial?: () => ILoadingSlice) {
    if (!initial) {
      this.initialize();
    } else {
      this._slices = initial();
    }
  }

  private initialize() {
    this._slices = createSlice({
      name: LoadingRepository.sliceName,
      initialState,
      reducers: {
        showLoading: (state: ILoadingState, action: PayloadAction<string>) => {
          return {
            ...state,
            loadingActions: this.addAction(
              state.loadingActions,
              action.payload
            ),
          };
        },
        hideLoading: (state: ILoadingState, action: PayloadAction<string>) => {
          return {
            ...state,
            loadingActions: this.removeAction(
              state.loadingActions,
              action.payload
            ),
          };
        },
        onFetching: (state: ILoadingState, action: PayloadAction<string>) => {
          return {
            ...state,
            fetchingActions: this.addAction(
              state.fetchingActions,
              action.payload
            ),
          };
        },
        nonFetching: (state: ILoadingState, action: PayloadAction<string>) => {
          return {
            ...state,
            fetchingActions: this.removeAction(
              state.fetchingActions,
              action.payload
            ),
            cachingActions: this.removeAction(
              state.cachingActions,
              action.payload
            ),
          };
        },
        onCaching: (
          state: ILoadingState,
          action: PayloadAction<{ type: string; payload: any }>
        ) => {
          const { type, payload } = action.payload;
          return {
            ...state,
            cachingActions: this.addCachingAction(
              state.cachingActions,
              type,
              payload
            ),
          };
        },
      },
    });
  }

  private addAction(actions: IActions, type: string): IActions {
    return { ...actions, [type]: true };
  }

  private removeAction(actions: IActions, type: string): IActions {
    const action = { ...actions };
    delete action[type];
    return action;
  }

  private addCachingAction(
    actions: ICacheActions,
    type: string,
    payload: any
  ): ICacheActions {
    return { ...actions, [type]: payload };
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

const loadingRepo = LoadingRepository.instance();
export { LoadingRepository, loadingRepo, ILoadingState, ILoadingSlice };
