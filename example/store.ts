import { createStore } from 'bee';

export interface IStoreState {
  id: number;
}

export default createStore({
  state: {
    id: 1
  }
});
