import React from 'react';
import render from 'react-test-renderer';
import createStore from '../src/create-store';
import Provider from '../src/provider';
import Relax from '../src/relax';
import { isFn } from '../src/util';

interface IRelaxProps {
  id: number;
  text: string;
  name: string;
  dispatch: Function;
  setState: Function;
}

const store = createStore({
  state: {
    name: 'test',
    list: [{ id: 1, text: 'test' }]
  }
});

const TestRelax = () => (
  <Relax
    relaxProps={[
      //
      ['list', 0, 'id'],
      'list.0.text',
      'name',
      'dispatch',
      'setState'
    ]}
    render={({ relaxProps }: { relaxProps: IRelaxProps }) => (
      <div>
        {relaxProps.id}
        {relaxProps.name}
        {relaxProps.text}
        {isFn(relaxProps.dispatch) && 'yes'}
        {isFn(relaxProps.setState) && 'yes'}
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
