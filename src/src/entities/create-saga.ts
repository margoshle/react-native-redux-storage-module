import {
  ActionCreatorWithPayload,
  ValidateSliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';

import type {
  IReduxAction,
  ICreateSagaOptions,
  IResult,
  ISlice,
  SpawnType,
} from './create-saga.d';
import {
  all,
  take,
  takeEvery,
  takeLatest,
  takeLeading,
  takeMaybe,
} from 'redux-saga/effects';

function getSpawnType(spawnType: SpawnType): any {
  switch (spawnType) {
    case 'take':
      return take;
    case 'takeEvery':
      return takeEvery;
    case 'takeLatest':
      return takeLatest;
    case 'takeLeading':
      return takeLeading;
    case 'takeMaybe':
      return takeMaybe;
    default:
      return undefined;
  }
}

export function createSaga<
  State extends any = any,
  ActionsType extends Record<
    string,
    IReduxAction<any, any, any> | undefined
  > = {}
>(
  options: ICreateSagaOptions<State, ActionsType>
): IResult<State, ActionsType> {
  const { name, initialState, reducers, extraReducers, sagas } = options;

  const newSlice: ISlice<State, ActionsType> = createSlice({
    name: name,
    initialState: initialState,
    reducers: reducers as ValidateSliceCaseReducers<State, any>,
    extraReducers: extraReducers,
  }) as ISlice<State, ActionsType>;
  const result: IResult<State, ActionsType> = {
    actions: newSlice.actions,
    reducer: newSlice.reducer,
    saga: undefined,
  };

  if (sagas && Object.keys(sagas).length > 0) {
    const _saga = function* createNewsaga() {
      yield all(
        Object.keys(sagas)
          .map((sagaName: string | keyof typeof sagas) =>
            getSpawnType(sagas?.[sagaName]?.spawnType)?.(
              result.actions?.[sagaName] as ActionCreatorWithPayload<any>,
              sagas?.[sagaName]?.action
            )
          )
          .filter((saga) => !!saga)
      );
    };

    result.saga = _saga;
  }

  return result;
}
