import { MockConsole } from 'mock-jest-console';
import React from 'react';
import renderer from 'react-test-renderer';
import { createStore, Provider, useRelax } from '../src';

const store = createStore({
  debug: true,
  state: {
    count: 1
  }
});

function DebugComponent() {
  const { count } = useRelax<{ count: number }>(['count'], 'HelloRelax');
  return <div>{count}</div>;
}

const DebugApp = () => (
  <Provider id="DebugApp" store={store}>
    <DebugComponent />
  </Provider>
);

it('test debug log', () => {
  const mock = new MockConsole();
  const tree = renderer.create(<DebugApp />);
  expect(tree).toMatchSnapshot();
  expect(mock.logs).toMatchSnapshot();
});
