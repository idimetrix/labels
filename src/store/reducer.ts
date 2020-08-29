import { RouterState } from 'react-router-redux';
import { CombinedState, combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as modal, ReduxModalState } from 'redux-modal';
import { History } from 'history';

import { IApiState } from './api/models';
import * as apiReducer from './api/reducer';
import { IAuthState } from './auth/models';
import * as authReducer from './auth/reducer';

export interface IRootState {
	readonly router: RouterState;
	readonly api: IApiState;
	readonly auth: IAuthState;
	readonly modal: ReduxModalState;
}

export const rootReducer: (history: History) => Reducer<CombinedState<IRootState>> = (history: History): Reducer<CombinedState<IRootState>> =>
	combineReducers<IRootState>({
		router: connectRouter(history) as any,
		api: apiReducer.reducer,
		auth: authReducer.reducer,
		modal,
	});
