import isEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import { Store } from '../store';
import { TRelaxPath } from '../types';
import { isArray, isObj, isStr } from '../util';

export default function withRelax(path: TRelaxPath = [], Cmp: any) {
  return class Relax extends React.Component {
    static contextTypes = { _iant$Store: PropTypes.object };

    constructor(props: any, ctx: any) {
      super(props);
      this._store = ctx._iant$Store;
      this._relaxMapper = reduceRelaxPropsMapper(path);
      this._relaxProps = computeRelaxProps(this._store, this._relaxMapper);

      if (process.env.NODE_ENV !== 'production') {
        if (this._store.debug) {
          console.log(`Relax(${Cmp.name}):`, this._relaxProps);
        }
      }
    }

    componentDidMount() {
      this._unsubscribe = this._store.subscribe(data => {
        this.setState(() => {
          data;
        });
      });
    }

    shouldComponentUpdate(nextProps: any) {
      if (!isEqual(nextProps, this.props)) {
        return true;
      }

      const newRelax = computeRelaxProps(this._store, this._relaxMapper);
      if (!isEqual(newRelax, this._relaxProps)) {
        this._relaxProps = newRelax;
        if (process.env.NODE_ENV !== 'production') {
          if (this._store.debug) {
            console.log(`Relax(${Cmp.name}): change:`, this._relaxProps);
          }
        }
        return true;
      }

      return false;
    }

    componentWillUnmount() {
      this._unsubscribe();
    }

    _store: Store;
    _relaxProps: Object;
    _relaxMapper: { [name: string]: Array<string | number> | string };
    _unsubscribe: () => void;

    render() {
      return <Cmp {...this.props} relaxProps={this._relaxProps} />;
    }
  };
}

/**
 * 归集属性
 * @param relaxProps
 */
function reduceRelaxPropsMapper(relaxProps: TRelaxPath) {
  const relaxPathMapper = {};

  for (let prop of relaxProps) {
    //如果当前的属性是数组
    //默认去最后一个字段的名称作为key
    //如果最后一位是数字，建议使用对象的方式
    if (isArray(prop)) {
      const len = prop.length;
      const last = prop[len - 1];
      relaxPathMapper[last] = prop;
    }
    //如果是字符串就直接以字符串作为key
    //如果是list.0.id这样的字符串就
    //先分割，然后走array一样的流程
    else if (isStr(prop)) {
      if (prop.indexOf('.') != -1) {
        const arr = prop.split('.');
        const len = arr.length;
        const last = arr[len - 1];
        relaxPathMapper[last] = arr;
      } else {
        relaxPathMapper[prop] = prop;
      }
    }
    //如果是对象
    else if (isObj(prop)) {
      Object.keys(prop).forEach(key => {
        let val = prop[key];
        if (isStr(val) && val.indexOf('.') != -1) {
          val = val.split('.');
        }
        relaxPathMapper[key] = val;
      });
    }
  }

  return relaxPathMapper;
}

/**
 * 计算relax路径对应的值
 * @param store
 * @param mapper
 */
function computeRelaxProps<T>(
  store: Store,
  mapper: { [name: string]: Array<string | number> | string }
) {
  const relaxData = {
    dispatch: store.dispatch,
    setState: store.setState
  };

  for (let prop in mapper) {
    if (mapper.hasOwnProperty(prop)) {
      const val = mapper[prop];
      relaxData[prop] = store.bigQuery(val);
    }
  }

  return relaxData as T & {
    dispatch: typeof store.dispatch;
    setState: typeof store.setState;
  };
}
