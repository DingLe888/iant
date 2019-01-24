import { Relax } from 'bee';
import React from 'react';
import { IStoreState } from '../store';

export interface IProps {
  relaxProps: {
    id: IStoreState['id'];
    setState: (data: Object) => void;
  };
}

export default function Text() {
  return (
    <Relax
      relaxProps={['id', 'setState']}
      render={({ relaxProps }: IProps) => {
        const { id, setState } = relaxProps;

        const click = () => {
          setState(data => {
            data.id = ++data.id;
          });
        };

        return <div onClick={click}>{id}</div>;
      }}
    />
  );
}
