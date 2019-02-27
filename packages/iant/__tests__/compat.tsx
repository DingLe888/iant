import React from 'react';
import renderer from 'react-test-renderer';
import { createStore, StoreProvider, withRelax } from '../src';

let store = createStore({
  state: {
    count: 1
  }
});

let Counter = withRelax(['count'], function Counter({ relaxProps }) {
  return <div>{relaxProps.count}</div>;
});

let TestApp = () => (
  <StoreProvider store={store} id="TestApp">
    <Counter />
  </StoreProvider>
);

it('test init', () => {
  const tree = renderer.create(<TestApp />);
  expect(tree).toMatchSnapshot();
});
