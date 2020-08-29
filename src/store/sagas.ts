import { all, fork } from 'redux-saga/effects';

import actionsSagas from './api/sagas';
import authSagas from './auth/sagas';

export default function* sagas(): Generator<any, any, any> {
	yield all([fork(actionsSagas)]);
	yield all([fork(authSagas)]);
}
