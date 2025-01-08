import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Engagement } from '../state.types';
import {
  getActiveEngagements,
  getEngagement,
} from './actions/engagement.action';

interface EngagementState {
  engagements: Engagement[];
  loading: boolean;
  searchQuery: string;
  selectedEngagement?: Engagement;
}

const initialState: () => EngagementState = () => ({
  engagements: [],
  loading: false,
  searchQuery: '',
});

const engagementSlice = createSlice({
  name: 'engagement',
  initialState: initialState(),
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    selectEngagement: (state, action: PayloadAction<Engagement>) => {
      state.selectedEngagement = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveEngagements.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveEngagements.fulfilled, (state, action) => {
        state.engagements = action.payload;
        state.loading = false;
      })
      .addCase(getActiveEngagements.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getEngagement.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEngagement = action.payload;
      })
      .addCase(getEngagement.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSearchQuery, selectEngagement } = engagementSlice.actions;

export default engagementSlice.reducer;
