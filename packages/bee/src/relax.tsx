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
    this._isMounted = false;
    this._relaxPropsMapper = this._reduceRelaxPropsMapper();
    this._relaxProps = this._computeRelaxProps();

    if (!this._isAllFn()) {
      this._unsubsciber = this._context.subscribe(this._handleSubscribe);
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  shouldComponentUpdate(nextProps: Object) {
    const nextRelaxProps = this._computeRelaxProps();
    if (nextProps !== this.props || nextRelaxProps != this._relaxProps) {
      this._relaxProps = nextRelaxProps;
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._unsubsciber && this._unsubsciber();
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this._isMounted = true;
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

  private _isMounted: boolean;
  private _context: Store;
  private _relaxPropsMapper: Object;
  private _relaxProps: Object;
  private _unsubsciber: Function;

  _computeRelaxProps() {
    const store: Store = this._context;
    const mapper = this._relaxPropsMapper;
    const relaxData = {};

    for (let prop in mapper) {
      const val = mapper[prop];
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

  _reduceRelaxPropsMapper() {
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

  _handleSubscribe = state => {
    if (this._isMounted) {
      this.setState(() => state);
    }
  };

  _isAllFn() {
    const mapper = this._relaxPropsMapper;
    //如果所有注入的属性都是setState或者dispatch，就不去监听subscribe
    for (let key in mapper) {
      const val = mapper[key];
      if (isStr(val) && (val === 'setState' || val === 'dispatch')) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
}
