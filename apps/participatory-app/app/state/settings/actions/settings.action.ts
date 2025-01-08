import { createAsyncThunk } from '@reduxjs/toolkit';
import { FileUtil } from 'common/utils/file';
import { DocTypeService } from 'data-layer/services/doctype';
import * as FileSystem from 'expo-file-system';

export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async () => {
    const response = await new DocTypeService('Engage Settings').get_doc(
      'Engage Settings',
    );
    return response;
  },
);

export const downloadLogo = createAsyncThunk(
  'settings/downloadLogo',
  async (image_url: string) => {
    const dest_folder = (FileSystem.documentDirectory || '') + 'temp';
    const res = await FileUtil.download_file(image_url, dest_folder);
    return res;
  },
);
