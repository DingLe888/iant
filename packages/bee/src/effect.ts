import produce from 'immer';
import { IEffect, IEffectProps } from './types';

export default function effect<T>(obj: IEffectProps<T>) {
  const immerHandler = {} as IEffect<T>;
  //all handler wrapper produce method
  for (let key in obj) {
    const handler = obj[key];
    immerHandler[key] = produce<T>(handler as any);
  }
  return immerHandler;
}
