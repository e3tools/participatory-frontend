import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BackendState {
  isBackendConnected: boolean;
  loading: boolean;
}

const initialState: () => BackendState = () => ({
  isBackendConnected: false,
  loading: false,
});

const backendSlice = createSlice({
  name: 'backend',
  initialState: initialState(),
  reducers: {
    setIsBackendConnected(state, action: PayloadAction<boolean>) {
      state.isBackendConnected = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setIsBackendConnected } = backendSlice.actions;

export default backendSlice.reducer;
