import { TActionHandler } from './types';

export default function action(msg: string, handler: TActionHandler) {
  return () => ({
    msg,
    handler
  });
}
