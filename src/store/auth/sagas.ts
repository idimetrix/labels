import { call, put, takeLatest, select } from 'redux-saga/effects';
import validator from 'validator';
import { push } from 'react-router-redux';

import {
	DEFAULT_USER,
	INVALID_EMAIL,
	INVALID_EMAIL_OR_PASSWORD,
	INVALID_FIRST_NAME,
	INVALID_LAST_NAME,
	INVALID_PASSWORD,
	INVALID_PASSWORD_CONFIRM,
	INVALID_RESPONSE,
} from '~/constants';
import {
	authorizationAction,
	AuthorizationActionsTypes,
	authorizationFailure,
	authorizationSuccess,
	ExitActionsTypes,
	exitFailure,
	exitSuccess,
	RegistrationActionsTypes,
	registrationFailure,
	registrationSuccess,
	UserActionsTypes,
	userFailure,
	userSuccess,
} from './actions';
import { IAuthorizationAction, IAuthorizationData, IExitAction, IRegistrationAction, IRegistrationData, IUserAction } from './models';
import { IRootState } from '~/store/reducer';
import { putFailure, putSuccess } from '~/store/handlers';

function* authorizationWorker({ payload }: IAuthorizationAction): Generator<any, any, any> {
	try {
		const { email, password }: IAuthorizationData = payload;

		if (!validator.isEmail(email) || email !== DEFAULT_USER.email) {
			return yield putFailure(authorizationFailure, INVALID_EMAIL);
		}
		if (!validator.isLength(password, { min: 6 }) || password !== DEFAULT_USER.password) {
			return yield putFailure(authorizationFailure, INVALID_PASSWORD);
		}

		const user: any = DEFAULT_USER;

		if (user) {
			yield putSuccess(authorizationSuccess, user);
			yield put(push('/home'));
		} else {
			throw INVALID_EMAIL_OR_PASSWORD;
		}
	} catch (e) {
		yield putFailure(authorizationFailure, e);
	}
}

function* registrationWorker({ payload }: IRegistrationAction): Generator<any, any, any> {
	try {
		const { firstName, lastName, email, password, confirm }: IRegistrationData = payload;

		if (!validator.isLength(firstName, { min: 1 })) {
			return yield putFailure(registrationFailure, INVALID_FIRST_NAME);
		}
		if (!validator.isLength(lastName, { min: 1 })) {
			return yield putFailure(registrationFailure, INVALID_LAST_NAME);
		}
		if (!validator.isEmail(email)) {
			return yield putFailure(registrationFailure, INVALID_EMAIL);
		}
		if (!validator.isLength(password, { min: 6 })) {
			return yield putFailure(registrationFailure, INVALID_PASSWORD);
		}
		if (password !== confirm) {
			return yield putFailure(registrationFailure, INVALID_PASSWORD_CONFIRM);
		}

		const { data }: any = yield call(null, payload);

		if (data && data.id) {
			yield putSuccess(registrationSuccess, data);
			yield putSuccess(authorizationAction, { email, password });
		} else {
			throw INVALID_EMAIL_OR_PASSWORD;
		}
	} catch (e) {
		yield putFailure(registrationFailure, e);
	}
}

function* exitWorker({ payload }: IExitAction): Generator<any, any, any> {
	try {
		yield putSuccess(exitSuccess);
		yield put(push('/auth/authorization'));
	} catch (e) {
		yield putFailure(exitFailure, e);
	}
}

function* userWorker({ payload }: IUserAction): Generator<any, any, any> {
	try {
		const state: IRootState = yield select();

		const { data }: any = yield call(null, state.auth.user.id);

		if (data) {
			yield putSuccess(userSuccess, data);
		} else {
			throw INVALID_RESPONSE;
		}
	} catch (e) {
		yield putFailure(userFailure, e);
	}
}

export default function* authSaga(): Generator<any, any, any> {
	yield takeLatest(AuthorizationActionsTypes.AUTHORIZATION_ACTION_REQUEST, authorizationWorker);
	yield takeLatest(RegistrationActionsTypes.REGISTRATION_ACTION_REQUEST, registrationWorker);
	yield takeLatest(ExitActionsTypes.EXIT_ACTION_REQUEST, exitWorker);
	yield takeLatest(UserActionsTypes.USER_ACTION_REQUEST, userWorker);
}
