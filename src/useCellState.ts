import {debounce, noop, throttle} from '@do-while-for-each/common';
import {Cell, Fn, ICellOpt} from '@do-while-for-each/tree-cell'
import {useCallback, useEffect, useState} from 'react'

interface IOpt extends ICellOpt<any> {
  throttle?: {
    time: number;
    leading: boolean;
    trailing: boolean;
  },
  debounceTime?: number;
}

export function useCellState<TValue>(val: Fn<TValue> | TValue, opt: IOpt = {}): [
  TValue,                     // value
  (newValue: TValue) => void, // setValue
  Cell,                       // cell
] {
  let valueSetter: any;
  const [cell] = useState(() => {
    const cell = new Cell(val, opt);
    cell.onChange(noop); // initialize the cell tree

    let onChangeCallback = (data: any) => {
      if (data.error)
        console.error(`state error:`, data.error);
      else
        valueSetter(data.value);
    };

    if (opt.throttle) {
      onChangeCallback = throttle(onChangeCallback, opt.throttle.time, opt.throttle);
    } else if (opt.debounceTime !== undefined) {
      onChangeCallback = debounce(onChangeCallback, opt.debounceTime);
    }
    cell.onChange(onChangeCallback);

    cell.offChange(noop);
    return cell;
  });

  const [value, realValueSetter] = useState(cell.get());
  if (valueSetter === undefined) {
    valueSetter = realValueSetter;
  }

  const setValue = useCallback( // to prevent pointless re-renders because 'setValue' can be passed as a prop to components
    (value: TValue) => cell.set(value),
    []
  );

  useEffect(() => {
    return () => cell.dispose();
  }, []);

  return [value, setValue, cell];
}
