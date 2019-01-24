import { IStoreProps } from './types';

export default function createStore<T>(props: IStoreProps<T>) {
  return props;
}
