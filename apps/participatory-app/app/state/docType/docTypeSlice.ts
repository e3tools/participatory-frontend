import { createSlice } from '@reduxjs/toolkit';
import { DocType } from '../state.types';
import { getDocTypes } from './actions/docType.action';

interface DocTypeState {
  doctypes: DocType[];
  loading: boolean;
}

const initialState: () => DocTypeState = () => ({
  doctypes: [],
  loading: false,
});

const docTypeSlice = createSlice({
  name: 'doctype',
  initialState: initialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocTypes.fulfilled, (state, action) => {
        state.doctypes = action.payload;
        state.loading = false;
      })
      .addCase(getDocTypes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default docTypeSlice.reducer;
