import { QueryLang } from './ql';
export type TQLang = Array<
  Array<string | number> | string | QueryLang | Function
>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export interface IStoreProps {
  state?: Object;
}
