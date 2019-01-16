import createStore from '../src/create-store';
import { QL } from '../src/ql';
import Store from '../src/store';
interface IState {
  list: Array<{ id: number; name: string }>;
  hello: string;
}

it('test store ', () => {
  let initState = {
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee'
  };
  const helloQL = QL('helloQL', ['hello', hello => hello + '!!']);

  const store = new Store<IState>(
    createStore({
      state: initState,
      ql: { helloQL }
    })
  );

  expect(store.getState()).toEqual({
    list: [{ id: 1, name: 'test' }],
    hello: 'hello bee',
    helloQL: 'hello bee!!'
  });

  const state = store.getState();
  store.subscribe(data => {
    expect(data).toEqual({
      list: [{ id: 2, name: 'test' }],
      hello: 'hello bee world',
      helloQL: 'hello bee world!!'
    });
  });

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
