import { QL } from '../src';

it('test ql', () => {
  const handler = (foo: string, bar: string) => foo + bar;
  const helloQL = QL([['foo', 1], 'bar', handler], 'helloQL');
  expect(helloQL.meta()).toEqual({
    id: 1,
    name: 'helloQL',
    deps: [['foo', 1], 'bar'],
    handler
  });
});
