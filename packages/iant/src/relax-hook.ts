import { useState, useContext, useEffect } from 'react';
import { isArray, isStr, isObj } from './util';
import { StoreContext } from './context';
import { Store } from './store';
import { IRelaxProps } from './types';

type TRelaxPath = Array<string | number | Array<string | number> | Object>;

function reduceRelaxPropsMapper(relaxProps) {
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

function computeRelaxProps(store: Store, mapper) {
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

export default function useRelax<T = {}>(props: TRelaxPath = []) {
  const store: Store = useContext(StoreContext);
  const relaxPropsMapper = reduceRelaxPropsMapper(props);
  const relaxData = computeRelaxProps(store, relaxPropsMapper);
  const { dispatch, setState, ...rest } = relaxData;

  const [relax, updateState] = useState(rest || {});

  useEffect(() => {
    return store.subscribe(() => {
      const newState = computeRelaxProps(store, relaxPropsMapper);
      updateState(newState);
    });
  });

  return [relax, { dispatch, setState }] as [
    T,
    { dispatch: typeof dispatch; setState: typeof setState }
  ];
}
