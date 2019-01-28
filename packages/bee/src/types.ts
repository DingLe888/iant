import { Immutable } from 'immer';
import { QueryLang } from './ql';
import { Store } from './store';

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export interface IStoreProps<T = Object> {
  state?: T;
  ql?: { [name: string]: QueryLang };
  effect?: IEffect<T>;
}

export type TSubscriber = (data: Object) => void;

export interface IEffectProps<T = Object> {
  [name: string]: (data: T, param?: any) => any;
}

export interface IEffect<T> {
  [name: string]: (base: Immutable<T>, param?: any) => Immutable<T>;
}

export interface IProviderProps {
  store: () => Store<any>;
  children?: any;
  onMounted?: () => void;
  onWillMount?: () => void;
  onUpdated?: () => void;
}

export interface IRelaxProps {
  setState: (cb: (data: Object) => void) => void;
  dispatch: (action: string, params?: any) => void;
}

export interface IRenderProps {
  relaxProps: IRelaxProps;
  [name: string]: any;
}

export type TRenderProps<T = {}> = keyof T extends 'relaxProps'
  ? { [K in keyof T]: K extends 'relaxProps' ? T[K] & IRelaxProps : T[K] }
  : T & IRelaxProps;

export interface IProps {
  relaxProps?: Array<any>;
  render: (props: TRenderProps<any>) => React.ReactElement<Object>;
  [name: string]: any;
}
