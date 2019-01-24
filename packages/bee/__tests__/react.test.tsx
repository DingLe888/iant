import React from 'react';
import render from 'react-test-renderer';
import createStore from '../src/create-store';
import Provider from '../src/provider';
import Relax from '../src/relax';
import { isFn } from '../src/util';

interface IRelaxProps {
  id: number;
  lname: string;
  name: string;
  dispatch: Function;
  setState: Function;
}

const store = createStore({
  state: {
    name: 'test',
    list: [{ id: 1, name: 'test' }]
  }
});

const TestRelax = () => (
  <Relax
    relaxProps={[
      //
      ['list', 0, 'id'],
      { lname: 'list.0.name' },
      'name',
      'dispatch',
      'setState'
    ]}
    render={({ relaxProps }: { relaxProps: IRelaxProps }) => (
      <div>
        {relaxProps.id}
        {relaxProps.name}
        {relaxProps.lname}
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

it('test no subscribe', () => {
  // let _ref = React.createRef();
  let _ref = null as any;

  const RelaxApp = () => (
    <Relax
      ref={ref => {
        _ref = ref;
      }}
      relaxProps={['dispatch', { setState: 'setState' }]}
      render={() => <div />}
    />
  );
  const TestApp = () => (
    <Provider store={store as any}>
      <RelaxApp />
    </Provider>
  );

  const tree = render.create(<TestApp />);
  expect(tree).toMatchSnapshot();
  expect(_ref._isAllFn()).toEqual(true);
});

it('test change state', () => {
  const RelaxApp = () => (
    <Relax
      relaxProps={['list.0.id']}
      render={({ relaxProps }) => <div>{relaxProps.id}</div>}
    />
  );

  let _ref = null as any;
  const TestApp = () => (
    <Provider
      store={store as any}
      ref={ref => {
        _ref = ref;
      }}
    >
      <RelaxApp />
    </Provider>
  );

  const tree = render.create(<TestApp />);
  expect(tree.toJSON()).toMatchSnapshot();

  _ref._store.setState(state => {
    state.list[0].id = 2;
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
