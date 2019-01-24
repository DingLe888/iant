import React from 'react';
import { StoreContext } from './context';
import Store from './store';
import { IStoreProps } from './types';

export interface IProps {
  store: IStoreProps;
  children?: any;
  onMounted?: () => void;
  onWillMounted?: () => void;
  onUpdated?: () => void;
}

export default class Provider extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this._store = new Store(this.props.store);
  }

  private _store: Store;

  componentWillMount() {
    this.props.onWillMounted && this.props.onWillMounted();
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted();
  }

  componentDidUpdate() {
    this.props.onUpdated && this.props.onUpdated();
  }

  componentDidCatch() {
    //error handler
  }

  render() {
    return (
      <StoreContext.Provider value={this._store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
