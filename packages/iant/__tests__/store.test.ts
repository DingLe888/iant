import { action, createStore, QL, Store } from '../src';

interface IState {
  list: Array<{ id: number; name: string }>;
  hello: string;
}

it('test store ', () => {
  let initState = {
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee'
  };
  const helloQL = QL(['hello', hello => hello + '!!'], 'helloQL');

  const store = createStore({
    state: initState,
    ql: { helloQL }
  })();

  expect(store.getState()).toEqual({
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee',
    helloQL: 'hello bee!!'
  });

  const state = store.getState();
  // store.subscribe(data => {
  //   expect(data).toEqual({
  //     list: [{ id: 2, name: 'test' }],
  //     hello: 'hello bee world',
  //     helloQL: 'hello bee world!!'
  //   });
  // });

  store.setState(data => {
    data.hello = 'hello bee world';
    data.list[0].id = 2;
  });

  const newState = store.getState();
  expect(newState).toEqual({
    list: [{ id: 2, name: 'test' }],
    hello: 'hello bee world',
    helloQL: 'hello bee world!!'
  });
  expect(state === store.getState()).toEqual(false);

  expect(initState).toEqual({
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee'
  });
});

it('test action', () => {
  let initState = {
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee'
  };
  const helloQL = QL(['hello', hello => hello + '!!'], 'helloQL');
  const effect = action('hello', (store: Store<IState>) => {
    store.setState(data => {
      data.list[0].id = 2;
    });
  });

  const store = createStore<IState>({
    state: initState,
    ql: { helloQL },
    action: { effect }
  })();

  store.dispatch('hello');

  expect(store.getState()).toEqual({
    list: [{ id: 2, name: 'test' }],
    helloQL: 'hello bee!!',
    hello: 'hello bee'
  });
});
