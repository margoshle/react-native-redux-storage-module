/* eslint-disable no-bitwise */
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {
  useReduxStorageDispatch,
  useReduxStorageSelector,
} from 'react-native-redux-storage-module';
import { ITodo, ITodoState, todoSaga } from '../../store/saga';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function TodoScreen() {
  const dispatch = useReduxStorageDispatch();
  const todo: ITodoState = useReduxStorageSelector<{ todo: ITodoState }>(
    (state) => state.todo
  );

  const addNewTodoItem = React.useCallback(() => {
    const newItem: ITodo = {
      id: uuidv4(),
      title: 'Test',
      author: 'Margosh.le',
      description:
        'Nulla irure commodo aliquip ex. Nostrud velit dolore magna duis aliqua ut veniam. Amet exercitation eiusmod consequat aute nulla commodo eu elit aute officia dolore mollit laboris ipsum.',
      createdAt: '2023-05-30',
    };
    dispatch(todoSaga.actions.addTodo(newItem));
  }, [dispatch]);

  const onPressDetail = React.useCallback(
    (todoItem: ITodo) => () => {
      dispatch(
        todoSaga.actions.getDetail({
          id: todoItem.id,
          callback: (data: ITodo) => {
            console.log('todoItem: ', data);
          },
        })
      );
    },
    [dispatch]
  );

  return (
    <SafeAreaView style={styles.fullScreen}>
      <View style={styles.container}>
        <Button title="Add New" onPress={addNewTodoItem} />
        <FlatList
          data={todo.todoList || []}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Pressable onPress={onPressDetail(item)}>
                <View style={styles.itemView}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
export default TodoScreen;
export { TodoScreen };

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'gray',
    fontStyle: 'italic',
  },
  itemView: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    minHeight: 40,
    marginHorizontal: 16,
    paddingVertical: 12,
  },
});
