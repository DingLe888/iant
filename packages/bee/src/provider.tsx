import React from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { IProviderProps } from './types';

export default class Provider extends React.Component<IProviderProps> {
  constructor(props: IProviderProps) {
    super(props);
    this._store = this.props.store();
  }

  private _store: Store;

  componentWillMount() {
    this.props.onWillMount && this.props.onWillMount();
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted();
  }

  componentDidUpdate() {
    this.props.onUpdated && this.props.onUpdated();
  }

  render() {
    return (
      <StoreContext.Provider value={this._store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
