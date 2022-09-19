import { iArticle, modal_name } from "../../interfaces";

export enum app_action_types {
    CLEAR_APP_STATE = 'APP/CLEAR_STATE',
    SET_DARK_MODE = 'APP/SET_DARK_MODE',
    OPEN_NEW_WINDOW = 'APP/OPEN_NEW_WINDOW',
    CLOSE_CHOOSEN_WINDOW = 'APP/CLOSE_CHOOSEN_WINDOW',
    SET_NEWS = 'APP/SET_NEWS',
    ADD_NEWS = 'APP/ADD_NEWS',
    SET_MODAL_ARTICLE = 'APP/SET_MODAL_ARTICLE',
    SET_FONT_SIZE = 'APP/SET_FONT_SIZE',
    SET_NEWS_COUNT = 'APP/SET_NEWS_COUNT',
    SET_USE_USER_LOCATION = 'APP/SET_USE_USER_LOCATION',
    SET_SEARCH_STRING = 'APP/SET_SEARCH_STRING',
}

export type app_action =
    clear_app_state |
    set_dark_mode |
    open_new_window |
    close_choosen_window |
    set_news |
    add_news |
    set_modal_article |
    set_font_size |
    set_news_count |
    set_use_user_location |
    set_serach_string
;

interface clear_app_state {
    type: app_action_types.CLEAR_APP_STATE,
}

interface set_dark_mode {
    type: app_action_types.SET_DARK_MODE,
    payload: boolean
}

interface open_new_window {
    type: app_action_types.OPEN_NEW_WINDOW,
    payload: modal_name
}

interface close_choosen_window {
    type: app_action_types.CLOSE_CHOOSEN_WINDOW,
    payload: modal_name
}

interface set_news {
    type: app_action_types.SET_NEWS,
    payload: iArticle[]
}

interface add_news {
    type: app_action_types.ADD_NEWS,
    payload: iArticle[]
}

interface set_modal_article {
    type: app_action_types.SET_MODAL_ARTICLE,
    payload: iArticle | null
}

interface set_font_size {
    type: app_action_types.SET_FONT_SIZE,
    payload: number
}

interface set_news_count {
    type: app_action_types.SET_NEWS_COUNT,
    payload: number
}

interface set_use_user_location {
    type: app_action_types.SET_USE_USER_LOCATION,
    payload: boolean
}

interface set_serach_string {
    type: app_action_types.SET_SEARCH_STRING,
    payload: string | null
}