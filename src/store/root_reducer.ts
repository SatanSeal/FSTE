import { combineReducers } from "redux";

import { app_reducer } from "./app/app_reducer";

export const root_reducer = combineReducers({
    app: app_reducer,
});