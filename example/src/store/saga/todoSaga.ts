import { PayloadAction, current } from '@reduxjs/toolkit';
import { createSaga } from 'react-native-redux-storage-module';
import type { IReduxAction } from 'react-native-redux-storage-module';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
}

export interface ITodoState {
  todos: Array<ITodo>;
}

interface ITodoAction {
  addTodo: IReduxAction<ITodo, undefined, undefined>;
  removeTodo: IReduxAction<number | ITodo, undefined, undefined>;
  editTodo: IReduxAction<ITodo, undefined, undefined>;
  getDetail: IReduxAction<{ id: string }, true, 'takeLatest'>;
}

const initialState: ITodoState = {
  todos: [],
};

export const todoSaga = createSaga<
  ITodoState,
  { [P in keyof ITodoAction]: ITodoAction[P] }
>({
  name: 'todo',
  initialState: initialState,
  reducers: {
    addTodo: (state: ITodoState, action: PayloadAction<ITodo>) => {
      const currentState = current(state);
      return {
        ...currentState,
        todos: [...(currentState.todos || []), action.payload],
      };
    },
    removeTodo: (
      _state: ITodoState,
      _action: PayloadAction<number | ITodo>
    ) => {},
    editTodo: (_state: ITodoState, _action: PayloadAction<ITodo>) => {},
    getDetail: (
      _state: ITodoState,
      _action: PayloadAction<{ id: string }>
    ) => {},
  },
  sagas: {
    getDetail: { action: function* () {} },
  },
});
