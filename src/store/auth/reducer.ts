import { LOCATION_CHANGE } from 'react-router-redux';

import { AuthorizationActionsTypes, ExitActionsTypes, RegistrationActionsTypes, UserActionsTypes } from './actions';
import { IAuthState, IUser } from './models';

const initialState: IAuthState = {
	token: JSON.parse(localStorage.getItem('token')) as string,
	user: JSON.parse(localStorage.getItem('user')) as IUser,
	loading: false,
	error: null,
};

export function reducer(state: IAuthState = initialState, action: any): IAuthState {
	switch (action.type) {
		// --- Location
		case LOCATION_CHANGE:
			return { ...state, error: null };

		// --- Authorization
		case AuthorizationActionsTypes.AUTHORIZATION_ACTION_REQUEST:
			return { ...state, loading: true };
		case AuthorizationActionsTypes.AUTHORIZATION_ACTION_SUCCESS:
			localStorage.setItem('token', JSON.stringify(action.payload));
			localStorage.setItem('user', JSON.stringify(action.payload));

			return {
				...state,
				loading: false,
				error: null,
				token: JSON.stringify(action.payload),
				user: action.payload as IUser,
			};
		case AuthorizationActionsTypes.AUTHORIZATION_ACTION_FAILURE:
			return { ...state, loading: false, error: action.payload };

		// --- Registration
		case RegistrationActionsTypes.REGISTRATION_ACTION_REQUEST:
			return { ...state, loading: true };
		case RegistrationActionsTypes.REGISTRATION_ACTION_SUCCESS:
			return { ...state, loading: false, error: null, user: null };
		case RegistrationActionsTypes.REGISTRATION_ACTION_FAILURE:
			return { ...state, loading: false, error: action.payload };

		// --- Exit
		case ExitActionsTypes.EXIT_ACTION_REQUEST:
			return { ...state, loading: true };
		case ExitActionsTypes.EXIT_ACTION_SUCCESS:
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('details');
			localStorage.removeItem('permissions');
			return { ...state, loading: false, error: null, token: null, user: null };
		case ExitActionsTypes.EXIT_ACTION_FAILURE:
			return { ...state, loading: false, error: action.payload };

		// --- User
		case UserActionsTypes.USER_ACTION_REQUEST:
			return { ...state, loading: true };
		case UserActionsTypes.USER_ACTION_SUCCESS:
			return { ...state, loading: false, error: null, user: action.payload };
		case UserActionsTypes.USER_ACTION_FAILURE:
			return { ...state, loading: false, error: action.payload };

		// ---
		default:
			return state;
	}
}

// Selectors

export const getToken: (state: IAuthState) => string = (state: IAuthState): string => state.token;
export const getUser: (state: IAuthState) => IUser = (state: IAuthState): IUser => state.user;
export const getLoading: (state: IAuthState) => boolean = (state: IAuthState): boolean => state.loading;
export const getError: (state: IAuthState) => string = (state: IAuthState): string => state.error;
