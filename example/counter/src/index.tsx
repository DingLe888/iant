import { Provider } from 'iant';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './component/counter';
import store from './store';

const ExampleApp = () => (
  <Provider store={store} id={'ExampleApp'}>
    <Counter />
  </Provider>
);

ReactDOM.render(<ExampleApp />, document.getElementById('app'));
