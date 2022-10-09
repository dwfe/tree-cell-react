import {useCallback, useEffect, useState} from 'react'
import {Cell, Fn} from '@do-while-for-each/tree-cell'
import {noop} from './util'

export function useCellState<TValue>(val: Fn<TValue> | TValue): [
  TValue,                     // value
  (newValue: TValue) => void, // setValue
  Cell,                       // cell
] {
  const [cell] = useState(() => {
    const cell = new Cell(val);
    cell.onChange(noop);
    return cell;
  });
  const [value, nextValue] = useState(cell.get());
  const setValue = useCallback( // to prevent pointless re-renders because 'setValue' can be passed as a prop to components
    (value: TValue) => cell.set(value),
    []
  );

  useEffect(() => {
    cell.onChange(data => {
      if (data.error)
        console.error('state error', data.error);
      else
        nextValue(data.value as TValue);
    });
    cell.offChange(noop);
    return () => cell.dispose();
  }, []);

  return [value, setValue, cell];
}
