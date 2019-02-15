import mitt from 'mitt';
import { useEffect } from 'react';

export type TMsgListeners = Array<{ name: string; handler: mitt.Handler }>;

export const msg: mitt.Emitter = new mitt();

export function useMsg(listners: TMsgListeners = []) {
  useEffect(() => {
    for (let { name, handler } of listners) {
      msg.on(name, handler);
    }
    return () => {
      for (let { name, handler } of listners) {
        msg.off(name, handler);
      }
    };
  });

  return msg;
}
