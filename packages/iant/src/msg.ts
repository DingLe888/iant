import mitt from 'mitt';
import { useEffect } from 'react';

const msg: mitt.Emitter = new mitt();

export default function useMsg(name: string, handler: mitt.Handler) {
  useEffect(() => {
    msg.on(name, handler);
    return msg.off(name, handler);
  });

  return msg;
}
