import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

// use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAuthDispatch = () => useDispatch<AppDispatch>();
export const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector;
