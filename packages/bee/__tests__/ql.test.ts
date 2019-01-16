import { QL } from '../src/ql';

it('test ql', () => {
  const handler = (foo: string, bar: string) => foo + bar;
  const helloQL = QL('helloQL', [['foo', 1], 'bar', handler]);
  expect(helloQL.meta()).toEqual({
    id: 1,
    name: 'helloQL',
    deps: [['foo', 1], 'bar'],
    handler
  });
});
