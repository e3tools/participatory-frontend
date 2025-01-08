import { EngagementService } from '@/app/services/engagement';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const saveCapturedData = createAsyncThunk(
  'capturedData/saveCapturedData',
  async (data: object) => {
    const response = await EngagementService.save_engagement_entry(data);
    return response;
  },
);
