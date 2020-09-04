import io from 'socket.io-client';
import { eventChannel, EventChannel } from 'redux-saga';
import { call, takeLatest, fork, take, put, ChannelTakeEffect } from 'redux-saga/effects';

import { putSuccess, putFailure } from '~/store/handlers';
import {
	EventApiTypes,
	eventFailure,
	EventsApiTypes,
	eventsFailure,
	eventsSuccess,
	eventSuccess,
	ImageApiTypes,
	imageFailure,
	ImagesApiTypes,
	imagesFailure,
	imagesSuccess,
	imageSuccess,
	SocketTypes,
	updateImageSuccess,
	updateLocksSuccess,
	updateViewsSuccess,
} from '~/store/api/actions';
import { IEventAction, IEventsAction, IImageAction, IImagesAction, ISocketAction } from '~/store/api/models';
import { eventApi, eventsApi, imageApi, imagesApi } from '~/api';

function connect(): Promise<any> {
	const socket: SocketIOClient.Socket = io(process.env.API_URL);

	return new Promise((resolve: (socket: SocketIOClient.Socket) => void): void => {
		socket.on('connect', (): void => resolve(socket));
	});
}

function subscribe(socket: SocketIOClient.Socket): EventChannel<any> {
	return eventChannel((emit: any): (() => void) => {
		socket.on('locked', (data: any): void => emit(updateLocksSuccess(data)));
		socket.on('viewed', (data: any): void => emit(updateViewsSuccess(data)));
		socket.on('updated', (data: any): void => emit(updateImageSuccess(data)));

		return (): void => {
			//
		};
	});
}

function* socketReadWorker(socket: SocketIOClient.Socket): Generator<any, any, any> {
	const channel: EventChannel<any> = yield call(subscribe, socket);

	while (true) {
		const action: ChannelTakeEffect<any> = yield take(channel);
		yield put(action);
	}
}

function* socketWriteWorker(socket: SocketIOClient.Socket): Generator<any, any, any> {
	while (true) {
		const {
			payload: { event, payload },
		}: ISocketAction = yield take(SocketTypes.SOCKET_ACTION);

		socket.emit(event, payload);
	}
}

function* sockets(): Generator<any, any, any> {
	const socket: SocketIOClient.Socket = yield call(connect);

	yield fork(socketReadWorker, socket);
	yield fork(socketWriteWorker, socket);
}

function* imagesWorker({ payload }: IImagesAction): Generator<any, any, any> {
	try {
		const { data }: any = yield call(imagesApi, payload);

		if (data) {
			yield putSuccess(imagesSuccess, data);
		} else {
			throw new Error('Error');
		}
	} catch (e) {
		console.log('Error', e);

		yield putFailure(imagesFailure, e);
	}
}

function* imageWorker({ payload }: IImageAction): Generator<any, any, any> {
	try {
		const { data }: any = yield call(imageApi, payload);

		if (data) {
			yield putSuccess(imageSuccess, data);
		} else {
			throw new Error('Error');
		}
	} catch (e) {
		console.log('Error', e);

		yield putFailure(imageFailure, e);
	}
}

function* eventsWorker({ payload }: IEventsAction): Generator<any, any, any> {
	try {
		const { data }: any = yield call(eventsApi, payload);

		if (data) {
			yield putSuccess(eventsSuccess, data);
		} else {
			throw new Error('Error');
		}
	} catch (e) {
		console.log('Error', e);

		yield putFailure(eventsFailure, e);
	}
}

function* eventWorker({ payload }: IEventAction): Generator<any, any, any> {
	try {
		const { data }: any = yield call(eventApi, payload);

		if (data) {
			yield putSuccess(eventSuccess, data);
		} else {
			throw new Error('Error');
		}
	} catch (e) {
		console.log('Error', e);

		yield putFailure(eventFailure, e);
	}
}

export default function* apiSaga(): Generator<any, any, any> {
	yield fork(sockets);
	yield takeLatest(ImageApiTypes.IMAGE_ACTION_REQUEST, imageWorker);
	yield takeLatest(ImagesApiTypes.IMAGES_ACTION_REQUEST, imagesWorker);
	yield takeLatest(EventApiTypes.EVENT_ACTION_REQUEST, eventWorker);
	yield takeLatest(EventsApiTypes.EVENTS_ACTION_REQUEST, eventsWorker);
}
