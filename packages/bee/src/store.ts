import produce from 'immer';
import { QueryLang } from './ql';
import { IReducer, IStoreProps, TPath, TSubscriber } from './types';
import { getPathVal, isArray, isStr } from './util';

export default class Store<T = Object> {
  constructor(props: IStoreProps<T>) {
    const { state = {}, ql, reducer } = props;
    this._state = state;
    this._cache = {};
    this._subscribe = [];
    this._ql = ql || this.ql();
    this._reducer = reducer;

    //merge rx
    const rx = this._computeQL();
    this._state = {
      ...this._state,
      ...rx
    };
  }

  private _state: Object;
  private _subscribe: Array<TSubscriber>;
  private _ql: { [name: string]: QueryLang };
  private _cache: { [key: number]: Array<any> };
  private _reducer: IReducer<T>;

  ql() {
    return {};
  }

  _computeQL() {
    return Object.keys(this._ql).reduce((r, k) => {
      const ql = this._ql[k];
      r[k] = this.bigQuery(ql);
      return r;
    }, {});
  }

  dispatch(action: string, params?: Object) {
    if (!this._reducer) {
      return;
    }
    const handler = this._reducer[action];
    const state = handler(this._state as any, params);
    if (state != this._state) {
      this._state = state;
      const rx = this._computeQL();
      this._state = {
        ...this._state,
        ...rx
      };
      for (let subscribe of this._subscribe) {
        subscribe(this._state);
      }
    }
  }

  getState() {
    return Object.freeze(this._state);
  }

  setState(callback: (data: T) => void) {
    const state = produce(this._state, callback as any);
    if (state != this._state) {
      this._state = state;
      const rx = this._computeQL();
      this._state = {
        ...this._state,
        ...rx
      };
      for (let subscribe of this._subscribe) {
        subscribe(this._state);
      }
    }
  }

  bigQuery(query: TPath | QueryLang) {
    if (isStr(query) || isArray(query)) {
      return getPathVal(this._state, query);
    } else if (query instanceof QueryLang) {
      let isChanged = false;
      const { id, deps, handler } = query.meta();
      //init cache
      this._cache[id] || (this._cache[id] = []);
      const len = deps.length;

      //计算pathVal
      deps.forEach((dep, i) => {
        const val = this.bigQuery(dep);
        if (val !== this._cache[id][i]) {
          isChanged = true;
        }
        this._cache[id][i] = val;
      });

      if (isChanged) {
        const depVal = this._cache[id].slice(0, len);
        const result = handler(...depVal);
        this._cache[id][len] = result;
        return result;
      } else {
        return this._cache[id][len];
      }
    }
  }

  subscribe(callback: TSubscriber) {
    let index = this._subscribe.indexOf(callback);

    if (index === -1) {
      this._subscribe.push(callback);
      index = this._subscribe.indexOf(callback);
    }

    return () => {
      this._subscribe.splice(index, 1);
    };
  }
}
