import React from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { IRelaxProps } from './types';
import { isArray, isObj, isStr } from './util';

/**
 * 获取组件的 displayName 便于 react-devtools 的调试
 * @param WrappedComponent
 */
export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default function Relax(
  relaxProps: Array<string | number | Array<string | number> | Object>,
  Wrapper: any
) {
  return class RelaxContainer extends React.Component {
    static displayName = `Relax(${getDisplayName(Wrapper)})`;
    static contextType = StoreContext;
    static defaultProps = {
      relaxProps: []
    };

    _isMounted: boolean;
    _context: Store;
    _relaxPropsMapper: Object;
    _relaxProps: IRelaxProps;
    _unsubsciber: Function;

    constructor(props: Object, ctx: Store) {
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
      const { ...other } = this.props;
      return <Wrapper {...other} relaxProps={this._relaxProps} />;
    }

    _computeRelaxProps() {
      const store: Store = this._context;
      const mapper = this._relaxPropsMapper;
      const relaxData = {} as IRelaxProps;

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
      //默认注入setState/dispatch
      const relaxData = {
        setState: 'setState',
        dispatch: 'dispatch'
      };

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
            if (prop.hasOwnProperty(key)) {
              const val = prop[key];
              relaxData[key] = val;
            }
          }
        }
      }

      return relaxData;
    }

    _handleSubscribe = (state: Object) => {
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
  };
}
