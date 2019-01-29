import { Relax } from 'bee';
import React from 'react';
import { IStoreState } from '../store';

export interface IProps {
  relaxProps: {
    id: IStoreState['id'];
    setState: (data: Object) => void;
  };
}

export default Relax(['id'], (props: IProps) => {
  const { id, setState } = props.relaxProps;

  const click = () => {
    setState(data => {
      data.id = ++data.id;
    });
  };

  return <div onClick={click}>{id}</div>;
});
