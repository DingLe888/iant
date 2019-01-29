import { QueryLang } from './ql';
import { Store } from './store';

export type TActionHandler = (store: Store<any>, param?: any) => void;

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export type TActionRetFn = () => { msg: string; handler: TActionHandler };

export type TAction = (msg: string, handler: TActionHandler) => TActionRetFn;

export interface IStoreProps<T = {}> {
  state?: T;
  ql?: { [name: string]: QueryLang };
  action?: { [name: string]: TActionRetFn };
}

export type TSubscriber = (data: Object) => void;

export interface IProviderProps {
  store: () => Store<any>;
  children?: any;
  onMounted?: (store?: Store) => void;
  onWillMount?: (store?: Store) => void;
  onUpdated?: (store?: Store) => void;
}

export interface IRelaxProps {
  setState: (cb: (data: any) => void) => void;
  dispatch: (action: string, params?: any) => void;
}

export interface IRenderProps {
  relaxProps: IRelaxProps;
  [name: string]: any;
}

export type TRenderProps<T = {}> = keyof T extends 'relaxProps'
  ? { [K in keyof T]: K extends 'relaxProps' ? T[K] & IRelaxProps : T[K] }
  : T & IRelaxProps;