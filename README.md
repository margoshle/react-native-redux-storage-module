# react-native-redux-storage-module

Build redux storage module with Redux, react-redux, redux-persist, redux-sage, redux-persist-transform-compress, redux-logger and using typescript

## Installation

Using npm

```sh
npm install react-native-redux-storage-module
```

Using yarn

```sh
yarn add react-native-redux-storage-module
```

- Installation on iOS/Android is completely handled with auto-linking.

## Usage

- Normal usage

```js
import * as React from 'react';
import {
  rootStoreManager,
  registerStore,
} from 'react-native-redux-storage-module';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// ...
class App extends React.Component {
    constructor(props: any) {
        super(props);
        registerStore({
            whiteList: [],
            reducer: { },
            sagas: [],
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
                {/* Children component */}
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
```

- Using with decorators

```js
import * as React from 'react';
import {
  rootStoreManager,
  registerStore,
} from 'react-native-redux-storage-module';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// ...
@registerStore({
  whiteList: [],
  reducer: { },
  sagas: [],
  blackList: [],
})
class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={rootStoreManager.getStore()!}>
        <PersistGate
          loading={<></>}
          persistor={rootStoreManager.getPersistStore!}
        >
            {/* Children component */}
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
```

- Advance using

```js
import * as React from 'react';
import {
  rootStoreManager,
  registerStore,
} from 'react-native-redux-storage-module';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// ...

// define class decorator for the initialize app root
function startApplication(_fn?: Function) {
  console.log(
    '------------------------------- Start initialize app root ----------------------------'
  );
  registerStore({
    whiteList: [],
    reducer: { },
    sagas: [],
    blackList: [],
  });
  console.log(
    '------------------------------- End initialize app root ----------------------------'
  );
}

@startApplication
class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={rootStoreManager.getStore()!}>
        <PersistGate
          loading={<></>}
          persistor={rootStoreManager.getPersistStore!}
        >
            {/* Children component */}
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
```

## Example with Todo list

Example within this repo can be found in the [TodoList README](example/README.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

React native redux storage module library is licensed under [The MIT License](LICENSE).

---

Made by [margosh.le](https://github.com/margoshle)
