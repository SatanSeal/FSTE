import { iArticle, modal_name } from "../../interfaces"
import { Dispatch } from "../store"

import { app_action_types } from "./app_types"


export function set_dark_mode(state: boolean) {
    return (dispatch : Dispatch) => {
        dispatch({
            type: app_action_types.SET_DARK_MODE,
            payload: state
        })
    }
}

export function open_new_window(name: modal_name) {
    return (dispatch : Dispatch) => {
        dispatch({
            type: app_action_types.OPEN_NEW_WINDOW,
            payload: name
        })
    }
}

export function close_choosen_window(choosen_window: modal_name) {
    return (dispatch : Dispatch) => {
        dispatch({
            type: app_action_types.CLOSE_CHOOSEN_WINDOW,
            payload: choosen_window
        })
    }
}

export function logout() {   // clears all states
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.CLEAR_APP_STATE,
        });
    }
}

export function set_news(news: iArticle[]) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_NEWS,
            payload: news
        })
    }
}

export function add_news(news: iArticle[]) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.ADD_NEWS,
            payload: news
        })
    }
}

export function open_article_modal(article: iArticle) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_MODAL_ARTICLE,
            payload: article
        });
        dispatch({
            type: app_action_types.OPEN_NEW_WINDOW,
            payload: 'article'
        })
    }
}

/**
 * Timeout in ms before clearing article
 */
export function close_article_modal(timeout: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.CLOSE_CHOOSEN_WINDOW,
            payload: 'article'
        })
        setTimeout(() => {
            dispatch({
                type: app_action_types.SET_MODAL_ARTICLE,
                payload: null
            });
        }, timeout);
    }
}

export function set_font_size(size: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_FONT_SIZE,
            payload: size
        })
    }
}

export function set_news_count(count: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_NEWS_COUNT,
            payload: count
        })
    }
}

export function set_use_user_location(payload: boolean) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_USE_USER_LOCATION,
            payload
        })
    }
}

export function set_serach_string(string: string) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: app_action_types.SET_SEARCH_STRING,
            payload: string
        })
    }
}