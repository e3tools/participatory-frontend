import { combineSlices } from '@reduxjs/toolkit';
import engagementReducer from './engagement/engagementSlice';
import dashboardReducer from './dashboard/dashboardSlice';
import backendReducer from './backend/backendSlice';
import { userSlice } from 'auth/state/user/userSlice';
import settingsReducer from './settings/settingsSlice';
import engagementEntryReducer from './engagementEntry/engagementEntrySlice';
import docTypeReducer from './docType/docTypeSlice';
import docSlicer from './doc/docSlice';
import capturedDataReducer from './capturedData/capturedDataSlice';

// const rootReducer = combineReducers({
//     engagement: engagementReducer,
//     doctype: doctypeReducer,
//     dashboard: dashboardReducer,
// });

const rootReducer = combineSlices(userSlice, {
  engagement: engagementReducer,
  dashboard: dashboardReducer,
  backend: backendReducer,
  settings: settingsReducer,
  engagementEntry: engagementEntryReducer,
  doc: docSlicer,
  docType: docTypeReducer,
  capturedData: capturedDataReducer,
});
export default rootReducer;
