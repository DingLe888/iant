import { Provider } from 'bee';
import React from 'react';
import ReactDOM from 'react-dom';
import Text from './component/text';
import store from './store';

const ExampleApp = () => (
  <Provider store={store}>
    <Text />
  </Provider>
);

ReactDOM.render(<ExampleApp />, document.getElementById('app'));
