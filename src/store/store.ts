import { legacy_createStore, compose, applyMiddleware, bindActionCreators } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

import { root_reducer } from './root_reducer';
import { iRedux_state } from '../interfaces';
import { show_redux } from '../settings';

import * as app_action_creators from './app/app_actions';

declare global{
	interface Window{
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : any;
	}
}

const compose_enhancers = (show_redux && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose ; 
 
export const store = legacy_createStore(root_reducer, compose_enhancers(
	applyMiddleware(thunk)
));

export type Dispatch = typeof store.dispatch;

export const useStoreDispatch = () => {		// combine all actions and wrapps it in dispatch 
	const dispatch = useDispatch();
	let all_action_creators = { 
		...app_action_creators,
	};
	return bindActionCreators(all_action_creators, dispatch);
}

export const use_store_selector: TypedUseSelectorHook<iRedux_state> = useSelector;	// gives access to redux store