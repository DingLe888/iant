import { QueryLang } from './ql';
import { Store } from './store';

export type TActionHandler = (store: Store<any>, param?: any) => void;

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export type TRelaxPath = Array<
  string | number | Array<string | number> | Object
>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export type TActionRetFn = () => { msg: string; handler: TActionHandler };

export type TAction = (msg: string, handler: TActionHandler) => TActionRetFn;

export interface IStoreProps<T = {}> {
  debug?: boolean;
  state?: T;
  ql?: { [name: string]: QueryLang };
  action?: { [name: string]: TActionRetFn };
}

export type TSubscriber = (data: Object) => void;

export interface IProviderProps<T> {
  children?: JSX.Element;
  store: () => Store<T>;
  onMounted?: (store: Store) => void;
  onWillMount?: (store: Store) => void;
  onWillUnmount?: () => void;
  id?: string;
}

export interface IRelaxProps {
  setState: (cb: (data: any) => void) => void;
  dispatch: (action: string, params?: any) => void;
}
