import React from 'react';
import render from 'react-test-renderer';
import createStore from '../src/create-store';
import Provider from '../src/provider';
import Relax from '../src/relax';

const store = createStore({
  state: {
    name: 'test',
    list: [{ id: 1, name: 'test' }]
  }
});

const TestRelax = () => (
  <Relax
    relaxProps={[['list', 0, 'id'], 'name']}
    render={props => (
      <div>
        {(props as any).id} {(props as any).name}
      </div>
    )}
  />
);

const TestApp = () => (
  <Provider store={store as any}>
    <TestRelax />
  </Provider>
);

it('test init', () => {
  const tree = render.create(<TestApp />);
  expect(tree).toMatchSnapshot();
});
