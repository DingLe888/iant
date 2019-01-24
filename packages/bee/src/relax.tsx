import React from 'react';
import { StoreContext } from './context';
import Store from './store';
import { isArray, isStr } from './util';
interface IProps {
  relaxProps: Array<any>;
  render: (props: Object) => React.ReactElement<Object>;
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
      ...this._relaxProps
    });
  }

  private _relaxProps: Object;
  private _context: Store;

  _computeRelaxProps() {
    const relaxData = {};
    const { relaxProps } = this.props;
    const store: Store = this._context;

    for (let prop of relaxProps) {
      //如果是数组，取最后一个名字，作为可以
      if (isArray(prop)) {
        const len = prop.length;
        const last = prop[len - 1];
        relaxData[last] = store.bigQuery(prop);
      }
      //如果是字符串
      else if (isStr(prop)) {
        if (prop === 'dispatch') {
          relaxData[prop] = store.dispatch;
        } else {
          relaxData[prop] = store.bigQuery(prop);
        }
      }
    }

    return relaxData;
  }
}
