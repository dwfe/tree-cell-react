import {Cell} from '@do-while-for-each/tree-cell';
import {Component} from 'react';

export function cellState<TState>(
  component: Component<TState>,
  handlers: {
    [key in keyof TState]?: TState[key] | (() => TState[key])
  }
): TState {
  if (Object.keys(handlers).length === 0) {
    throw new Error('handlers need to be passed');
  }
  const data: [Cell, string][] = [];
  const initState: TState = {} as TState;

  for (const [key, value] of Object.entries(handlers)) {
    if (typeof value === 'function') {
      const cell = new Cell(() => ({
        [key]: value()
      }));
      cell.onChange(noop);
      data.push([cell, key]);
      try {
        initState[key] = cell.get()[key];
      } catch (error) {
        console.error(`state initialization error: this.state.${key}`, component, error);
      }
    } else
      initState[key] = value;
  }
  if (data.length) {
    const origDidMount = component.componentDidMount;
    component.componentDidMount = function () {
      origDidMount?.call(component);
      for (const [cell, key] of data) {
        cell.onChange(({error, value}) => {
          if (error)
            console.error(`state error: this.state.${key}`, component, error);
          else
            component.setState(value);
        });
        cell.offChange(noop);
      }
    };
    const origWillUnmount = component.componentWillUnmount;
    component.componentWillUnmount = function () {
      origWillUnmount?.call(component);
      for (const [cell] of data)
        cell.dispose();
    };
  }
  return initState as TState;
}

function noop() {
}
