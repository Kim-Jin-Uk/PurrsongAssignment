import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Index from './screens/index'
import reducers from './reducers/main';

const store = createStore(reducers)

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Index></Index>
      </Provider>
    </>
  );
}

export default App