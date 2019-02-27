import isEqual from 'fast-deep-equal';
import { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from './context';
import { computeRelaxProps, isNeedRx, reduceRelaxPropsMapper } from './helper';
import { Store } from './store';
import { TRelaxPath } from './types';

export default function useRelax<T = {}>(
  props: TRelaxPath = [],
  name: string = ''
) {
  const store: Store = useContext(StoreContext);
  const relaxPropsMapper = reduceRelaxPropsMapper(props);
  const relaxData = computeRelaxProps<T>(store, relaxPropsMapper);
  const [relax, updateState] = useState(relaxData);

  //get last relax state
  const preRelax = useRef(null);
  useEffect(() => {
    preRelax.current = relax;
  });

  if (process.env.NODE_ENV !== 'production') {
    if (store.debug && name && !preRelax.current) {
      console.log(`Relax(${name}):`, relax);
    }
  }

  //only componentDidMount && componentWillUnmount
  useEffect(() => {
    if (isNeedRx(relaxPropsMapper)) {
      return store.subscribe(() => {
        const newState = computeRelaxProps<T>(store, relaxPropsMapper);
        if (!isEqual(newState, preRelax.current)) {
          if (process.env.NODE_ENV !== 'production') {
            if (store.debug && name) {
              console.log(`Relax(${name})-update:`, newState);
            }
          }
          updateState(newState);
        }
      });
    } else {
      return () => {};
    }
  }, []);

  return relax;
}
