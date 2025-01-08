import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { downloadLogo, getSettings } from './actions/settings.action';
import { ColorScheme, CustomSettings } from '../state.types';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

interface SettingsState {
  settings: CustomSettings;
  colorScheme: ColorScheme;
  loading: boolean;
}

const initialState: () => SettingsState = () => ({
  settings: {
    app_name: 'Engage',
    county_name: 'Makueni',
    county_slogan: 'Making Makueni Great',
    logo: require('../../assets/images/logoipsum.png'),
    app_slogan: 'Enhance Citizen Engagement',
    app_introduction:
      'Under key tenets of inform, consult, involve, Collaborate & Empower',
  },
  colorScheme: {
    light: {
      text: '#000',
      background: '#fff',
      tint: tintColorLight,
      tabIconDefault: '#ccc',
      tabIconSelected: tintColorLight,
    },
    dark: {
      text: '#fff',
      background: '#000',
      tint: tintColorDark,
      tabIconDefault: '#ccc',
      tabIconSelected: tintColorDark,
    },
  },
  loading: false,
});

const customizationSlice = createSlice({
  name: 'settings',
  initialState: initialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getSettings.fulfilled,
        (state, action: PayloadAction<CustomSettings>) => {
          state.settings = action.payload;
        },
      )
      .addCase(getSettings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(downloadLogo.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        downloadLogo.fulfilled,
        (state, action: PayloadAction<string | undefined>) => {
          state.settings.logoUri = action.payload;
          state.loading = false;
        },
      )
      .addCase(downloadLogo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customizationSlice.reducer;
