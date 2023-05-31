import {
  ActionReducerMapBuilder,
  CaseReducerActions,
  CaseReducers,
  PayloadAction,
  Reducer,
  Slice,
} from '@reduxjs/toolkit';
import type { NoInfer } from 'react-redux';
export type SpawnType =
  | 'take'
  | 'takeEvery'
  | 'takeMaybe'
  | 'takeLatest'
  | 'takeLeading'
  | undefined;

type ConcatX<T> = (a: T, b: T) => T;
type SagaParams<Payload> = {
  type: string;
  payload: Payload;
};
export type GenericFunction<Payload> = (
  params: SagaParams<Payload>
) => Generator<ForkEffect<never>, void, unknown>;
export type RemoveUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type ConvertSagaAction<ActionsType> = {
  [K in keyof ActionsType]: ActionsType[K]['isSaga'] extends boolean
    ? {
        spawnType?: ActionsType[K]['spawnType'] extends SpawnType
          ? ActionsType[K]['spawnType']
          : undefined;
        action: GenericFunction<ActionsType[K]['type']>;
      }
    : undefined;
};

export type ICreateSagaOptions<
  State = any,
  ActionsType extends Record<
    string,
    IReduxAction<any, any, any> | undefined
  > = {},
  Name extends string = string
> = {
  name: Name;
  initialState: State | (() => State);
  reducers: ISliceAction<State, ActionsType>;
  extraReducers?:
    | CaseReducers<NoInfer<State>, any>
    | ((builder: ActionReducerMapBuilder<NoInfer<State>>) => void);
  sagas: RemoveUndefined<ConvertSagaAction<ActionsType>>;
};

export type ISliceAction<State, ActionType> = {
  [K in keyof ActionType]: (
    state: State,
    payload: PayloadAction<
      ActionType[K] extends any ? ActionType[K]['type'] : any
    >
  ) => State | undefined | void;
};

export type ISlice<
  State = any,
  ActionsType extends Record<string, any> = {}
> = Slice<State, ISliceAction<State, ActionsType>, string>;

export type IResult<State, ActionsType> = {
  actions: CaseReducerActions<ISliceAction<State, ActionsType>, string>;
  reducer: Reducer<State>;
  saga: any;
};

/**
 * @interface IActionType
 *
 * @typedef {type} - type alias payload
 * @typedef {isSaga} - has create middleware saga
 *
 * Spawns a saga on each action dispatched to the Store that matches pattern
 * @typedef {spawnType} - includes take | takeEvery | takeMaybe | takeLatest | takeLeading
 *
 */
export interface IReduxAction<
  Payload extends any = any,
  HS extends undefined | boolean = undefined,
  ST extends SpawnType = undefined
> {
  type: Payload;
  isSaga: HS;
  spawnType: ST;
}
