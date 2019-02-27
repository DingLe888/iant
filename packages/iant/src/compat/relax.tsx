import isEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { computeRelaxProps, isNeedRx, reduceRelaxPropsMapper } from '../helper';
import { Store } from '../store';
import { TRelaxPath } from '../types';

export default function withRelax(path: TRelaxPath = [], Cmp: any) {
  return class Relax extends React.Component {
    static contextTypes = { _iant$Store: PropTypes.object };

    _store: Store;
    _relaxProps: Object;
    _relaxMapper: { [name: string]: Array<string | number> | string };
    _unsubscribe: () => void;

    constructor(props: any, ctx: any) {
      super(props);
      this._store = ctx._iant$Store;
      this._relaxMapper = reduceRelaxPropsMapper(path);
      this._relaxProps = computeRelaxProps(this._store, this._relaxMapper);

      //如果需要箭筒store的变化
      if (isNeedRx(this._relaxMapper)) {
        this._unsubscribe = this._store.subscribe(data => {
          this.setState(() => {
            data;
          });
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        if (this._store.debug) {
          console.log(`Relax(${Cmp.name}):`, this._relaxProps);
        }
      }
    }

    shouldComponentUpdate(nextProps: Object) {
      //如果传入的属性发生变化就更新
      if (!isEqual(nextProps, this.props)) {
        return true;
      }
      //计算新的relax的值
      const newRelax = computeRelaxProps(this._store, this._relaxMapper);
      //如果发生变化就直接更新
      if (!isEqual(newRelax, this._relaxProps)) {
        this._relaxProps = newRelax;
        if (process.env.NODE_ENV !== 'production') {
          if (this._store.debug) {
            console.log(`Relax(${Cmp.name}): change:`, this._relaxProps);
          }
        }
        return true;
      }
      //否则就不更新
      return false;
    }

    componentWillUnmount() {
      this._unsubscribe && this._unsubscribe();
    }

    render() {
      return <Cmp {...this.props} relaxProps={this._relaxProps} />;
    }
  };
}
