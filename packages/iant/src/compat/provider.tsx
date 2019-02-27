import PropTypes from 'prop-types';
import React from 'react';
import { Store } from '../store';
import { IProviderProps } from '../types';

const noop = () => {};

export default class StoreProvider<T> extends React.Component<
  IProviderProps<T>
> {
  //set default props
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };

  //set context type
  static childContextTypes = { _iant$Store: PropTypes.object };

  //set children context
  getChildContext: Function = (): Object => {
    return { _iant$Store: this._store };
  };

  private _store: Store<T>;

  constructor(props: IProviderProps<T>) {
    super(props);
    this._store = props.store();

    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this._store.debug) {
        console.log('Provider enable debug mode');
        if (props.id) {
          (global || window)[props.id] = { store: this._store };
        }
      }
    }
  }

  componentDidMount() {
    this.props.onMounted(this._store);
  }

  componentWillUnmount() {
    this.props.onMounted(this._store);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
