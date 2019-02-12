import { useRelax } from 'iant';
import React from 'react';
import { IState } from '../store';

type TRelax = { count: IState['count'] };

export default function Counter() {
  const [relax, { setState }] = useRelax<TRelax>(['count']);

  const inc = () =>
    setState((data: IState) => {
      data.count++;
    });

  const dec = () =>
    setState((data: IState) => {
      data.count--;
    });

  return (
    <div>
      <a href={'javascript:void(0);'} onClick={inc}>
        Inc
      </a>

      {relax.count}

      <a href={'javascript:void(0);'} onClick={dec}>
        Dec
      </a>
    </div>
  );
}
