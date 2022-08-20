import {Component} from 'react';

export function cellState<TState>(
  component: Component<TState>,
  obj: { [key in keyof TState]?: TState[key] | (() => TState[key]) }
): TState {
  const initState: Partial<TState> = {};



  return initState as TState;
}
