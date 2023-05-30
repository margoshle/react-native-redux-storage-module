import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../storage';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useReduxStorageDispatch = () => useDispatch();
export const useReduxStorageSelector: <S extends any = {}>(
  arg0: (state: RootState<S>) => any
) => any = useSelector;
