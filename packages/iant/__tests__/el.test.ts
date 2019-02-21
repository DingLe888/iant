import { MockConsole } from 'mock-jest-console';
import { createStore, EL } from '../src';

const mottEL = EL(
  [
    'count',
    'mott',
    (count: number, mott: string) => {
      console.log(mott + count);
    }
  ],
  'mottEl'
);

it('test', () => {
  const mock = new MockConsole();
  const store = createStore({
    debug: true,
    el: { mottEL },
    state: {
      count: 1,
      mott: 'build tools for human.'
    }
  })();
  store.setState(state => {
    state.count = 2;
  });
  expect(mock.logs).toMatchSnapshot();
});
