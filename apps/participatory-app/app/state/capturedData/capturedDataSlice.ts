import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENGAGEMENT_TYPES } from '../../constants/enums';
import { saveCapturedData } from './actions/capturedData.action';

export type CapturedEntry = {
  engagement: string;
  engagementType: string;
  doctype: string;
  data: object;
};

// type keys = { [key in keyof typeof ENGAGEMENT_TYPES]: string[] };

interface CaptureDataState {
  /*
  records are stored as 
  { 
    survey : {engagement1: data, engagement1: data2 },
    quickPoll : {engagement3: data3, engagement4: data4 },
  }
  */
  currentRecord?: CapturedEntry;
  records: Record<string, Record<string, CapturedEntry>>;
  loading: boolean;
  saveSuccess: boolean;
  saveResponse: object;
}

const initialState: () => CaptureDataState = () => ({
  currentRecord: undefined,
  records: {},
  loading: false,
  saveSuccess: false,
  saveResponse: {},
});

const capturedDataSlice = createSlice({
  name: 'capturedData',
  initialState: initialState(),
  reducers: {
    setCurrentRecord: (state, action: PayloadAction<CapturedEntry>) => {
      state.currentRecord = action.payload;
    },
    addCapturedData: (state, action: PayloadAction<CapturedEntry>) => {
      // setFormValue(
      //   state,
      //   action.payload.engagement,
      //   action.payload.engagementType, // ENGAGEMENT_TYPES.SURVEY,
      //   action.payload.doctype,
      //   action.payload.data,
      // );
      const engagement = action.payload.engagement;
      const engagement_type = action.payload.engagementType;
      const doctype = action.payload.doctype;
      const data = action.payload.data;

      const records = { ...(state.records || {}) };

      if (!(engagement_type in records)) {
        records[engagement_type] = {};
      }
      if (!(engagement in records[engagement_type])) {
        records[engagement_type][engagement] = {} as CapturedEntry;
      }
      if (!records[engagement_type][engagement]) {
        records[engagement_type][engagement] = {} as CapturedEntry;
      }
      if (!(doctype in records[engagement_type][engagement])) {
        records[engagement_type][engagement][doctype] = {};
      }
      records[engagement_type][engagement][doctype] = data || {};
      state.records = { ...records };
    },
    clearCapturedData: (state) => {
      state.records = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveCapturedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCapturedData.fulfilled, (state, action) => {
        state.saveResponse = action.payload;
        state.saveSuccess = true;
        state.loading = false;
      })
      .addCase(saveCapturedData.rejected, (state) => {
        state.loading = false;
        state.saveSuccess = false;
      });
  },
});

const setFormValue = (
  state: CaptureDataState,
  engagement: string,
  engagement_type: string,
  doctype: string,
  data: object,
) => {
  if (!(engagement_type in state.records)) {
    state.records[engagement_type] = {};
  }
  if (!(engagement in state.records[engagement_type])) {
    state.records[engagement_type][engagement] = {};
  }
  if (!state.records[engagement_type][engagement]) {
    state.records[engagement_type][engagement] = {};
  }
  if (!(doctype in state.records[engagement_type][engagement])) {
    state.records[engagement_type][engagement][doctype] = {};
  }
  state.records[engagement_type][engagement][doctype] = data || {};
};

export const { setCurrentRecord, addCapturedData, clearCapturedData } =
  capturedDataSlice.actions;

export default capturedDataSlice.reducer;
