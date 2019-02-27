import { StoreProvider, withRelax } from 'iant';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';

const Counter = withRelax(['count'], ({ relaxProps: { setState, count } }) => {
  const inc = () =>
    setState(data => {
      data.count++;
    });

  const dec = () =>
    setState(data => {
      data.count--;
    });

  return (
    <div>
      <a href={'javascript:void(0);'} onClick={inc}>
        Inc
      </a>

      {count}

      <a href={'javascript:void(0);'} onClick={dec}>
        Dec
      </a>
    </div>
  );
});

function CounterApp() {
  return (
    <StoreProvider store={store}>
      <Counter />
    </StoreProvider>
  );
}

ReactDOM.render(<CounterApp />, document.getElementById('app'));
