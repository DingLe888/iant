import { QueryLang } from './ql';

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export interface IStoreProps {
  state?: Object;
  ql?: { [name: string]: QueryLang };
  methods?: { [name: string]: Function };
}

export type TSubscriber = (data: Object) => void;
