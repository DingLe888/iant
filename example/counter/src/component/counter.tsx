import { Relax, TRenderProps } from 'iant';
import React from 'react';
import { IState } from '../store';

type TProps = TRenderProps<{ relaxProps: { count: IState['count'] } }>;

export default Relax(['count'], (props: TProps) => {
  const { count, setState } = props.relaxProps;

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

      {count}

      <a href={'javascript:void(0);'} onClick={dec}>
        Dec
      </a>
    </div>
  );
});
