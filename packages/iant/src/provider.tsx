import React from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { IProviderProps } from './types';

const noop = () => {};

export default class Provider<T = {}> extends React.Component<
  IProviderProps<T>
> {
  static defaultProps = {
    onWillMount: noop,
    onMounted: noop,
    onWillUnmount: noop
  };

  private _store: Store<T>;

  constructor(props: IProviderProps<T>) {
    super(props);
    this._store = this.props.store();

    //dev
    if (process.env.NODE_ENV !== 'production') {
      if (this._store.debug) {
        (global || window)[props.id || 'provider'] = this._store;
      }
    }
  }

  componentWillMount() {
    this.props.onWillMount(this._store);
  }

  componentDidMount() {
    this.props.onMounted(this._store);
  }

  componentDidUpdate() {
    this.props.onMounted(this._store);
  }

  render() {
    return (
      <StoreContext.Provider value={this._store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
