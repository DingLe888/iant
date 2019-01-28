import produce from 'immer';
import { IReducer, IReducerProps } from './types';

export default function effect<T>(obj: IReducerProps<T>) {
  const immerHandler = {} as IReducer<T>;
  //all handler wrapper produce method
  for (let key in obj) {
    const handler = obj[key];
    immerHandler[key] = produce<T>(handler as any);
  }
  return immerHandler;
}
