import { iApp_state } from "../../interfaces";
import { app_action, app_action_types} from "./app_types";

const initial_state: iApp_state = {
    dark_mode: true,
    opened_windows: [],
    news: [],
    opened_article: null, 
    font_size: 16,
    news_fetch_count: 12,
    use_user_loaction: true,
    search_string: null,
}

export const app_reducer = ( state = initial_state, action: app_action) : iApp_state => {
    switch (action.type){

        case app_action_types.CLEAR_APP_STATE:
            return {
                ...initial_state,
                dark_mode: state.dark_mode,
                font_size: state.font_size,
                news_fetch_count: state.font_size,
            };

        case app_action_types.SET_DARK_MODE:
            return {...state, dark_mode: action.payload};

        case app_action_types.OPEN_NEW_WINDOW:
            let increased_open_windows = state.opened_windows.slice();
            increased_open_windows.push(action.payload);
            return {...state, opened_windows: increased_open_windows};

        case app_action_types.CLOSE_CHOOSEN_WINDOW:
            let open_windows_choosen = state.opened_windows.slice();
            let index = open_windows_choosen.indexOf(action.payload);
            if (index >= 0){
                open_windows_choosen.splice(index, 1);
            }
            return {...state, opened_windows: open_windows_choosen};
            
        case app_action_types.SET_NEWS:
            return {...state, news: action.payload};

        case app_action_types.ADD_NEWS:
            return {
                ...state,
                news: state.news.slice().concat(action.payload)
            };

        case app_action_types.SET_MODAL_ARTICLE:
            return {
                ...state,
                opened_article: action.payload
            };

        case app_action_types.SET_FONT_SIZE:
            return {...state, font_size: action.payload};

        case app_action_types.SET_NEWS_COUNT:
            return {...state, news_fetch_count: action.payload};

        case app_action_types.SET_USE_USER_LOCATION:
            return {...state, use_user_loaction: action.payload};

        case app_action_types.SET_SEARCH_STRING:
            return {...state, search_string: action.payload};

        default: return state;
    }
}