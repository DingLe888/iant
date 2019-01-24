import { Immutable } from 'immer';
import { QueryLang } from './ql';

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export interface IStoreProps<T = Object> {
  state?: T;
  ql?: { [name: string]: QueryLang };
  reducer?: IReducer<T>;
}

export type TSubscriber = (data: Object) => void;

export interface IReducerProps<T = Object> {
  [name: string]: (data: T, param?: any) => any;
}

export interface IReducer<T> {
  [name: string]: (base: Immutable<T>, param?: any) => Immutable<T>;
}
