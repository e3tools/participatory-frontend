import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDBReadParam } from 'data-layer/interfaces/database';
import { DocTypeService } from 'data-layer/services/doctype';

export const getEngagements = createAsyncThunk(
  'engagement/getEngagements',
  async () => {
    const response = await new DocTypeService('Engagement').get_all();
    return response;
  },
);

export const getActiveEngagements = createAsyncThunk(
  'engagement/getActiveEngagements',
  async () => {
    let cfg = {} as IDBReadParam;
    cfg.filters = [
      ['status', '=', 'Open'],
      ['is_published', '=', 1],
    ];
    cfg.fields = ['*'];
    const response = await new DocTypeService('Engagement').get_list(cfg);
    return response;
  },
);

export const getEngagement = createAsyncThunk(
  'engagement/getEngagement',
  async (id: string) => {
    const response = await new DocTypeService('Engagement').get_doc(id);
    return response;
  },
);
