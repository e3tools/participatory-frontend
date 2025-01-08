import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocTypeService } from 'data-layer/services/doctype';

export const getDocTypes = createAsyncThunk('docType/getDocTypes', async () => {
  const response = await new DocTypeService('DocType').get_all();
  return response;
});
