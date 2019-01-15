import { QueryLang } from './ql';
import { IStoreProps } from './types';

export class Store {
  constructor(props: IStoreProps) {
    const { state } = props;
    this._state = state;
  }

  private _state: Object;

  getState() {
    return Object.freeze(this._state);
  }

  bigQuery(query: Array<number | string> | string | QueryLang) {}
}
