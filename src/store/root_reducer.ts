import { combineReducers } from "redux";

import { app_reducer } from "./app/app_reducer";
// import { IM_reducer } from "./info_modal/IM_reducer";

export const root_reducer = combineReducers({
    app: app_reducer,
    // info_modal: IM_reducer,
});