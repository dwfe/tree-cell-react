import {useCallback, useEffect, useState} from 'react'
import {Cell, Fn} from '@do-while-for-each/tree-cell'

export function useCellState<TValue>(val: Fn<TValue> | TValue): [
  TValue,                     // value
  (newValue: TValue) => void, // setValue
  Cell,                       // cell
] {
  const [, rerender] = useState({});
  const [cell] = useState(() => {
    const cell = new Cell(val);
    cell.onChange(data => {
      rerender({});
    });
    return cell;
  });

  const setValue = useCallback( // to prevent pointless re-renders because 'setValue' can be passed as a prop to components
    (value: TValue) => cell.set(value),
    []
  );

  useEffect(() => {
    return () => cell.dispose();
  }, []);

  return [cell.get(), setValue, cell];
}
