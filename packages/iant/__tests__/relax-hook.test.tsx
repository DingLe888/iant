import { useRelax, createStore, Provider } from '../src';
import renderer from 'react-test-renderer';
import React, { useEffect } from 'react';

const store = createStore({
  state: {
    count: 1,
    todo: [{ id: 1, text: 'react hooks', done: false }]
  }
});

function Relax() {
  //@ts-ignore
  const [relax, { setState }] = useRelax<{ count: number; text: string }>([
    'count',
    'todo.0.text'
  ]);

  useEffect(() => {
    setTimeout(() => {
      setState(state => {
        state.count = 2;
      });
    });
  });

  return (
    <div>
      <div>{relax.count}</div>
      <div>{relax.text}</div>
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <Relax />
  </Provider>
);

it('test relax hook', () => {
  const tree = renderer.create(<App />);
  expect(tree).toMatchSnapshot();
});
