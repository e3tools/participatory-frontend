import { createSlice } from "@reduxjs/toolkit";
import { Engagement } from "../state.types";
import { getActiveEngagements, getEngagements } from "./actions/engagement.action";

interface EngagementState {
    engagements: Engagement[],
    loading: boolean,
}

const initialState: () => EngagementState = () => ({
    engagements: [],
    loading: false,
})

const engagementSlice = createSlice({
    name: 'engagement',
    initialState: initialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getActiveEngagements.pending, state => {
            state.loading = true;
        })
        .addCase(getActiveEngagements.fulfilled, (state, action) => {
            state.engagements = action.payload
            state.loading = false;
        })
        .addCase(getActiveEngagements.rejected, state => {
            state.loading = false;
        })
    }
})

export default engagementSlice.reducer;