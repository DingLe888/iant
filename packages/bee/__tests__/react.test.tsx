import React from 'react';
import render from 'react-test-renderer';
import { createStore, Provider, Relax } from '../src';
import { TRenderProps } from '../src/relax';
import { isFn } from '../src/util';

type TRelaxProps = TRenderProps<{
  relaxProps: {
    id: number;
    lname: string;
    name: string;
  };
}>;

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
      'name'
    ]}
    render={(props: TRelaxProps) => (
      <div>
        {props.relaxProps.id}
        {props.relaxProps.name}
        {props.relaxProps.lname}
        {isFn(props.relaxProps.dispatch) && 'yes'}
        {isFn(props.relaxProps.setState) && 'yes'}
      </div>
    )}
  />
);

const TestApp = () => (
  <Provider store={store}>
    <TestRelax />
  </Provider>
);

it('test init', () => {
  const tree = render.create(<TestApp />);
  expect(tree).toMatchSnapshot();
});

it('test no subscribe', () => {
  let _ref = null as any;

  const RelaxApp = () => (
    <Relax
      ref={ref => {
        _ref = ref;
      }}
      render={() => <div />}
    />
  );
  const TestApp = () => (
    <Provider store={store}>
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
      render={({ relaxProps }: TRelaxProps) => <div>{relaxProps.id}</div>}
    />
  );

  let _ref = null as any;
  const TestApp = () => (
    <Provider
      store={store}
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

it('test defaultInject setState and dispatch', () => {
  const RelaxApp = () => (
    <Relax
      render={(props: TRelaxProps) => {
        return <div>{isFn(props.relaxProps.setState) && 'yes'}</div>;
      }}
    />
  );
  const TestApp = () => (
    <Provider store={store}>
      <RelaxApp />
    </Provider>
  );

  const tree = render.create(<TestApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
