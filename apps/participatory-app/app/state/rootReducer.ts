import { combineReducers, combineSlices } from "@reduxjs/toolkit";
import engagementReducer from './engagement/engagementSlice';
import doctypeReducer from './doctype/doctypeSlice';
import dashboardReducer from './dashboard/dashboardSlice'; 
import backendReducer from  './backend/backendSlice';
import { userSlice } from "auth/state/user/userSlice";


// const rootReducer = combineReducers({
//     engagement: engagementReducer,
//     doctype: doctypeReducer,
//     dashboard: dashboardReducer,
// });

const rootReducer = combineSlices(userSlice, {
    engagement: engagementReducer,
    doctype: doctypeReducer,
    dashboard: dashboardReducer,
    backend: backendReducer,
});
export default rootReducer;