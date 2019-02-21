import { createStore } from 'iant';

export interface IState {
  count: number;
}

export default createStore<IState>({
  state: {
    count: 1
  }
});
