import React from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { IProviderProps } from './types';

export default class Provider extends React.Component<IProviderProps> {
  constructor(props: IProviderProps) {
    super(props);
    this._store = this.props.store();
    //listener
    this._unsubscriber = this._store.subscribe(state => {
      this.setState(() => state);
    });
  }

  private _store: Store;
  private _unsubscriber: Function;

  componentWillMount() {
    this.props.onWillMount && this.props.onWillMount(this._store);
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted(this._store);
  }

  componentDidUpdate() {
    this.props.onUpdated && this.props.onUpdated(this._store);
  }

  componentWillUnmount() {
    this._unsubscriber();
  }

  render() {
    return (
      <StoreContext.Provider value={this._store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
