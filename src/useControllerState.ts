import {useEffect, useState} from 'react';
import {useCellState} from './useCellState';

interface IController<TState> {
  dispose?(): void;

  state: TState;
}

/**
 * Автоматические подписка на состояние контроллера и его dispose
 */
export function useControllerState<TController extends IController<any>>(f: () => TController): [TController['state'], TController] {
  const [controller] = useState(() => f());
  const [state] = useCellState(() => controller.state);

  useEffect(() => {
    return controller.dispose?.bind(controller);
  }, []);

  return [state, controller];
}
