import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

import { IRootState } from '~/store/reducer';

const jwt: Middleware = ({ dispatch, getState }: MiddlewareAPI<Dispatch, IRootState>): any => {
	return (next: Dispatch): Dispatch => <T extends AnyAction>(action: T): T => {
		return next(action);
	};
};

export default jwt;
