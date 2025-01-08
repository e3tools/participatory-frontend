import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDoc } from './actions/doc.action';

interface DocState {
  docs: object[];
  currentDoc: object;
  loading: boolean;
}

const initialState: () => DocState = () => ({
  docs: [],
  currentDoc: {},
  loading: false,
});

const docSlice = createSlice({
  name: 'doc',
  initialState: initialState(),
  reducers: {
    setCurrentDoc: (state, action: PayloadAction<object>) => {
      state.currentDoc = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoc.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoc.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoc = action.payload;
      })
      .addCase(getDoc.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCurrentDoc } = docSlice.actions;
export default docSlice.reducer;
