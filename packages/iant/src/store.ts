import produce from 'immer';
import ReactDOM from 'react-dom';
import { QueryLang } from './ql';
import {
  IStoreProps,
  TActionHandler,
  TActionRetFn,
  TPath,
  TSubscriber
} from './types';
import { getPathVal, isArray, isStr } from './util';

/**
 * 是不是可以批量处理
 * ReactDOM'sunstable_batchedUpdates 可以很酷的解决父子组件级联渲染的问题
 * 可惜 Preact 不支持，只能靠 Immutable 的不可变这个特性来挡着了
 * 在 react-native 环境中，unstable_batchedUpdates 是在 react-native 对象中
 * 所以我们的 babel-plugin-plume2 就是去解决这个问题
 */
const batchedUpdates =
  ReactDOM.unstable_batchedUpdates ||
  function(cb: Function) {
    cb();
  };

export class Store<T = {}> {
  constructor(props: IStoreProps<T>) {
    const { state = {}, ql = {}, action = {} } = props;
    this._ql = ql;
    this._state = state as T;
    this._action = this._reduceAction(action);

    this.debug = false;
    this._cache = {};
    this._subscribe = [];

    this._computeQL();
  }

  private _state: T;
  private _subscribe: Array<TSubscriber>;
  private _ql: { [name: string]: QueryLang };
  private _cache: { [key: number]: Array<any> };
  private _action: { [name: string]: TActionHandler };
  public readonly debug: boolean;

  private _computeQL() {
    const rx = Object.keys(this._ql).reduce((r, k) => {
      const ql = this._ql[k];
      r[k] = this.bigQuery(ql);
      return r;
    }, {});

    this._state = {
      ...this._state,
      ...rx
    };
  }

  private _reduceAction(actions: {
    [name: string]: TActionRetFn;
  }): { [name: string]: TActionHandler } {
    return Object.keys(actions).reduce((r, key) => {
      const action = actions[key];
      const { msg, handler } = action();
      r[msg] = handler;
      return r;
    }, {});
  }

  dispatch = (action: string, params?: Object) => {
    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.debug) {
        console.groupCollapsed(`dispath:-> ${action}`);
        console.log(`params: ${JSON.stringify(params, null, 2)}`);
      }
    }

    const handler = this._action[action];
    if (!handler) {
      //debug
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug) {
          console.log(`Oops, Could not find any handler`);
        }
      }
      return;
    }

    //debug
    if (process.env.NODE_ENV !== 'production') {
      if (this.debug) {
        console.groupEnd();
      }
    }

    handler(this, params);
  };

  getState() {
    return Object.freeze(this._state);
  }

  setState = (callback: (data: T) => void) => {
    const state = produce(this._state, callback as any);
    if (state != this._state) {
      this._state = state as T;
      this._computeQL();
      batchedUpdates(() => {
        for (let subscribe of this._subscribe) {
          subscribe(this._state);
        }
      });
    }
  };

  bigQuery(query: TPath | QueryLang) {
    if (isStr(query) || isArray(query)) {
      return getPathVal(this._state, query);
    } else if (query instanceof QueryLang) {
      let isChanged = false;
      const { id, deps, name, handler } = query.meta();
      //init cache
      this._cache[id] || (this._cache[id] = []);
      const len = deps.length;

      //debug log
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug && name) {
          console.groupCollapsed(`BigQuery(${name}):|>`);
        }
      }

      //计算pathVal
      deps.forEach((dep, i) => {
        const val = this.bigQuery(dep);
        if (val !== this._cache[id][i]) {
          isChanged = true;
        }

        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            const name =
              dep instanceof QueryLang ? `QL(${dep.meta.name})` : dep;
            console.log(`dep -> ${name}, val -> ${val}`);
          }
        }

        this._cache[id][i] = val;
      });

      if (isChanged) {
        const depVal = this._cache[id].slice(0, len);
        const result = handler(...depVal);
        this._cache[id][len] = result;

        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && !name) {
            console.log(`result: isChanged->${isChanged}, val->${result}`);
            console.groupEnd();
          }
        }

        return result;
      } else {
        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && !name) {
            console.log(
              `result: isChanged->${false}, val->${this._cache[id][len]}`
            );
            console.groupEnd();
          }
        }

        return this._cache[id][len];
      }
    }
  }

  subscribe = (callback: TSubscriber) => {
    let index = this._subscribe.indexOf(callback);

    if (index === -1) {
      this._subscribe.push(callback);
      index = this._subscribe.indexOf(callback);
    }

    return () => {
      this._subscribe.splice(index, 1);
    };
  };

  //=====================debug===========================
  pprint() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(this._state, null, 2));
    }
  }
}

export const createStore = <T>(props: IStoreProps<T>) => () =>
  new Store<T>(props);
