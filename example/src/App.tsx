import * as React from 'react';
import {
  rootStoreManager,
  registerStore,
} from 'react-native-redux-storage-module';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { todoSaga } from './store/saga/todoSaga';
import { TodoScreen } from './screens';

@startApplication
// @registerStore({
//   whiteList: [],
//   reducer: { todo: todoSaga.reducer },
//   sagas: [todoSaga.saga],
//   blackList: [],
// })
class App extends React.Component {
  constructor(props: any) {
    super(props);
    registerStore({
      whiteList: [],
      reducer: { todo: todoSaga.reducer },
      sagas: [todoSaga.saga],
      blackList: [],
    });
  }
  render(): React.ReactNode {
    return (
      <Provider store={rootStoreManager.getStore()!}>
        <PersistGate
          loading={<></>}
          persistor={rootStoreManager.getPersistStore!}
        >
          <TodoScreen />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

// define class decorator for the initialize app root
function startApplication(_fn?: Function) {
  console.log(
    '------------------------------- Start initialize app root ----------------------------'
  );
  registerStore({
    whiteList: ['todo'],
    reducer: { todo: todoSaga.reducer },
    sagas: [todoSaga.saga],
    blackList: [],
  });
  console.log(
    '------------------------------- End initialize app root ----------------------------'
  );
}
