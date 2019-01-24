import React from 'react';
import { StoreContext } from './context';
import Store from './store';
import { isArray, isObj, isStr } from './util';

export interface IRenderProps {
  relaxProps: any;
  [name: string]: any;
}

export interface IProps {
  relaxProps: Array<any>;
  render: (props: IRenderProps) => React.ReactElement<Object>;
  [name: string]: any;
}

export default class Relax extends React.Component<IProps> {
  static displayName = 'RelaxContext';
  static contextType = StoreContext;

  constructor(props: IProps, ctx: Store) {
    super(props);
    this._context = ctx;
    this._relaxProps = this._computeRelaxProps();
  }

  render() {
    const { render, relaxProps, ...other } = this.props;
    return render({
      ...other,
      relaxProps: {
        ...this._relaxProps
      }
    });
  }

  private _relaxProps: Object;
  private _context: Store;

  _computeRelaxProps() {
    const store: Store = this._context;
    const relaxData = this._reduceRelaxProps();

    for (let prop in relaxData) {
      const val = relaxData[prop];
      //如果是数组，取最后一个名字，作为可以
      if (isArray(val)) {
        relaxData[prop] = store.bigQuery(val);
      }
      //如果是字符串
      else if (isStr(prop)) {
        if (prop === 'dispatch' || prop === 'setState') {
          relaxData[prop] = store[prop];
        } else {
          relaxData[prop] = store.bigQuery(val);
        }
      }
    }

    return relaxData;
  }

  _reduceRelaxProps() {
    const { relaxProps } = this.props;
    const relaxData = Object.create(null);

    for (let prop of relaxProps) {
      if (isArray(prop)) {
        const len = prop.length;
        const last = prop[len - 1];
        relaxData[last] = prop;
      } else if (isStr(prop)) {
        if (prop.indexOf('.') != -1) {
          const arr = prop.split('.');
          const len = arr.length;
          const last = arr[len - 1];
          relaxData[last] = arr;
        } else {
          relaxData[prop] = prop;
        }
      } else if (isObj(prop)) {
        for (let key in prop) {
          if (prop.hasOwnProperty()) {
            const val = prop[key];
            relaxData[key] = val;
          }
        }
      }
    }

    return relaxData;
  }
}
