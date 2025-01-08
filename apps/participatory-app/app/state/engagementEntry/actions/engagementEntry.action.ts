import { EngagementService } from '@/app/services/engagement';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDBReadParam } from 'data-layer/interfaces/database';
import { DocTypeService } from 'data-layer/services/doctype';

export const getEngagementEntries = createAsyncThunk(
  'engagementEntry/getEngagementEntries',
  async () => {
    const response = await new DocTypeService('Engagement Entry').get_all();
    return response;
  },
);

export const getEngagementEntriesByUser = createAsyncThunk(
  'engagementEntry/getEngagementEntriesByUser',
  async (user: string) => {
    let cfg = {} as IDBReadParam;
    cfg.filters = [
      ['entered_by', '=', user],
      ['docstatus', '<', 3],
    ];
    cfg.fields = ['*'];
    const response = await new DocTypeService('Engagement Entry').get_list(cfg);
    return response;
  },
);

export type DraftEngagementProps = {
  user: string;
  engagement: string;
};

export const getDraftEngagementEntriesByUser = createAsyncThunk(
  'engagementEntry/getDraftEngagementEntriesByUser',
  async (data: Props) => {
    const { user, engagement } = data;
    let cfg = {} as IDBReadParam;
    cfg.filters = [
      ['entered_by', '=', user],
      ['docstatus', '<', 3],
      ['status', '=', 'Draft'],
      ['engagement', '=', engagement],
    ];
    cfg.fields = ['*'];
    const response = await new DocTypeService('Engagement Entry').get_list(cfg);
    return response;
  },
);

export const getEngagementEntryData = createAsyncThunk(
  'engagementEntry/getEngagementEntryData',
  async (entry: string) => {
    const response = EngagementService.get_engagement_entry_record(entry);
    return response;
  },
);
