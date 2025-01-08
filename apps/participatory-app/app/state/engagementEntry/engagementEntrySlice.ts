import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EngagementEntry } from '../state.types';
import {
  getDraftEngagementEntriesByUser,
  getEngagementEntries,
  getEngagementEntriesByUser,
  getEngagementEntryData,
} from './actions/engagementEntry.action';

interface EngagementEntryState {
  entries: EngagementEntry[];
  draftEntries: EngagementEntry[];
  loading: boolean;
  selectedEntry?: EngagementEntry;
  selectedEntryData?: object;
}

const initialState: () => EngagementEntryState = () => ({
  entries: [],
  draftEntries: [],
  loading: false,
  selectedEntry: undefined,
  selectedEntryData: undefined,
});

const engagementEntrySlice = createSlice({
  name: 'engagementEntry',
  initialState: initialState(),
  reducers: {
    setSelectedEntry: (state, action: PayloadAction<EngagementEntry>) => {
      state.selectedEntry = action.payload;
    },
    setEngagementEntryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEngagementEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEngagementEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.loading = false;
      })
      .addCase(getEngagementEntries.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getEngagementEntriesByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEngagementEntriesByUser.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.loading = false;
      })
      .addCase(getEngagementEntriesByUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDraftEngagementEntriesByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDraftEngagementEntriesByUser.fulfilled, (state, action) => {
        state.draftEntries = action.payload;
        state.loading = false;
      })
      .addCase(getDraftEngagementEntriesByUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getEngagementEntryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEngagementEntryData.fulfilled, (state, action) => {
        state.selectedEntryData = action.payload;
        state.loading = false;
      })
      .addCase(getEngagementEntryData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedEntry, setEngagementEntryLoading } =
  engagementEntrySlice.actions;

export default engagementEntrySlice.reducer;
