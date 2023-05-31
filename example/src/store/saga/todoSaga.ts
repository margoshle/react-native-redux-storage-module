import { PayloadAction, current } from '@reduxjs/toolkit';
import { RootState, createSaga } from 'react-native-redux-storage-module';
import type { IReduxAction } from 'react-native-redux-storage-module';
import { select } from 'redux-saga/effects';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
}

export interface ITodoState {
  todoList: Array<ITodo>;
}

interface ITodoAction {
  addTodo: IReduxAction<ITodo, undefined, undefined>;
  removeTodo: IReduxAction<number | ITodo, undefined, undefined>;
  editTodo: IReduxAction<ITodo, undefined, undefined>;
  getDetail: IReduxAction<RequestGetDetailPayload, true, 'takeLatest'>;
}

const initialState: ITodoState = {
  todoList: [],
};
type RequestGetDetailPayload = IRequestAction<{ id: string }>;
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
        todoList: [...(currentState.todoList || []), action.payload],
      };
    },
    removeTodo: (state: ITodoState, _action: PayloadAction<number | ITodo>) => {
      const currentState = current(state);
      let idxItem =
        typeof _action.payload === 'number'
          ? _action.payload
          : !_action.payload
          ? -1
          : currentState.todoList?.findIndex(
              (todo) => todo.id === (_action.payload as ITodo)?.id
            );

      if (idxItem !== -1) {
        currentState.todoList.splice(idxItem, 1);
      }

      return {
        ...currentState,
      };
    },
    editTodo: (state: ITodoState, _action: PayloadAction<ITodo>) => {
      const currentState = current(state);
      let idxItem = !_action.payload
        ? -1
        : currentState.todoList?.findIndex(
            (todo) => todo.id === _action.payload.id
          );
      return {
        ...currentState,
        todoList: currentState.todoList.map((todo, index) =>
          index === idxItem ? _action.payload : todo
        ),
      };
    },
    getDetail: (
      _state: ITodoState,
      _action: PayloadAction<RequestGetDetailPayload>
    ) => {
      /**
       * func define using for a saga middlewares
       * noting code here
       * */
    },
  },
  sagas: {
    getDetail: {
      spawnType: 'takeLatest',
      action: function* ({ type, payload }) {
        console.log(`type: ${type}, payload: `, payload);
        const todoList = (yield select(
          (state: RootState<{ todo: ITodoState }>) => state.todo.todoList
        )) as ITodo[];
        try {
          const idxTodoItem = todoList?.findIndex(
            (todo) => (todo.id = payload.id)
          );

          if (idxTodoItem !== -1) {
            payload?.callback?.(todoList[idxTodoItem]);
            payload?.onSuccess?.(todoList[idxTodoItem]);
          }
        } catch (error) {
          payload?.onError?.(error);
        }
      },
    },
  },
});
