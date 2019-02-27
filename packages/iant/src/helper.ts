import { Store } from './store';
import { TRelaxPath } from './types';
import { isArray, isObj, isStr } from './util';

/**
 * 根据relaxPropsMapper的key做分析
 * 如果仅仅有setState或者dispatch，
 * 就不去监听store的变化
 * @param relaxPropsMapper
 */
export function isNeedRx(relaxPropsMapper: Object) {
  let keys = Object.keys(relaxPropsMapper);
  for (let key of keys) {
    if (key !== 'setState' && key !== 'dispatch') {
      return true;
    }
  }
  return false;
}

/**
 * 归集属性
 * @param relaxProps
 */
export function reduceRelaxPropsMapper(relaxProps: TRelaxPath) {
  const relaxPathMapper = {};

  for (let prop of relaxProps) {
    //如果当前的属性是数组
    //默认去最后一个字段的名称作为key
    //如果最后一位是数字，建议使用对象的方式
    if (isArray(prop)) {
      const len = prop.length;
      const last = prop[len - 1];
      relaxPathMapper[last] = prop;
    }
    //如果是字符串就直接以字符串作为key
    //如果是list.0.id这样的字符串就
    //先分割，然后走array一样的流程
    else if (isStr(prop)) {
      if (prop.indexOf('.') != -1) {
        const arr = prop.split('.');
        const len = arr.length;
        const last = arr[len - 1];
        relaxPathMapper[last] = arr;
      } else {
        relaxPathMapper[prop] = prop;
      }
    }
    //如果是对象
    else if (isObj(prop)) {
      Object.keys(prop).forEach(key => {
        let val = prop[key];
        if (isStr(val) && val.indexOf('.') != -1) {
          val = val.split('.');
        }
        relaxPathMapper[key] = val;
      });
    }
  }

  return relaxPathMapper;
}

/**
 * 计算relax路径对应的值
 * @param store
 * @param mapper
 */
export function computeRelaxProps<T>(
  store: Store,
  mapper: { [name: string]: Array<string | number> | string }
) {
  const relaxData = {
    dispatch: store.dispatch,
    setState: store.setState
  };

  for (let prop in mapper) {
    if (mapper.hasOwnProperty(prop)) {
      const val = mapper[prop];
      relaxData[prop] = store.bigQuery(val);
    }
  }

  return relaxData as T & {
    dispatch: typeof store.dispatch;
    setState: typeof store.setState;
  };
}
