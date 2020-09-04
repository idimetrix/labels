import { action } from 'typesafe-actions';

import {
	IEventAction,
	IEventState,
	IEventsAction,
	IEventsData,
	IImageAction,
	IImageData,
	IImagesAction,
	IImagesData,
	ISocketData,
	IUpdateImageAction,
	IUpdateImageData,
	IUpdateLocksAction,
	IUpdateLocksData,
	IUpdateViewsAction,
	IUpdateViewsData,
} from './models';

// --- Image

export enum ImageApiTypes {
	IMAGE_ACTION_REQUEST = 'IMAGE_ACTION_REQUEST',
	IMAGE_ACTION_SUCCESS = 'IMAGE_ACTION_SUCCESS',
	IMAGE_ACTION_FAILURE = 'IMAGE_ACTION_FAILURE',
}

export const imageAction: (payload: IImageData) => IImageAction = (payload: IImageData): IImageAction => action(ImageApiTypes.IMAGE_ACTION_REQUEST, payload);

export const imageSuccess: (payload?: any) => IImageAction = (payload?: any): IImageAction => action(ImageApiTypes.IMAGE_ACTION_SUCCESS, payload);

export const imageFailure: (payload?: any) => IImageAction = (payload?: any): IImageAction => action(ImageApiTypes.IMAGE_ACTION_FAILURE, payload);

// --- Images

export enum ImagesApiTypes {
	IMAGES_ACTION_REQUEST = 'IMAGES_ACTION_REQUEST',
	IMAGES_ACTION_SUCCESS = 'IMAGES_ACTION_SUCCESS',
	IMAGES_ACTION_FAILURE = 'IMAGES_ACTION_FAILURE',
}

export const imagesAction: (payload: IImagesData) => IImagesAction = (payload: IImagesData): IImagesAction =>
	action(ImagesApiTypes.IMAGES_ACTION_REQUEST, payload);

export const imagesSuccess: (payload?: any) => IImagesAction = (payload?: any): IImagesAction => action(ImagesApiTypes.IMAGES_ACTION_SUCCESS, payload);

export const imagesFailure: (payload?: any) => IImagesAction = (payload?: any): IImagesAction => action(ImagesApiTypes.IMAGES_ACTION_FAILURE, payload);

// --- Event

export enum EventApiTypes {
	EVENT_ACTION_REQUEST = 'EVENT_ACTION_REQUEST',
	EVENT_ACTION_SUCCESS = 'EVENT_ACTION_SUCCESS',
	EVENT_ACTION_FAILURE = 'EVENT_ACTION_FAILURE',
}

export const eventAction: (payload: IEventState) => IEventAction = (payload: IEventState): IEventAction => action(EventApiTypes.EVENT_ACTION_REQUEST, payload);

export const eventSuccess: (payload?: any) => IEventAction = (payload?: any): IEventAction => action(EventApiTypes.EVENT_ACTION_SUCCESS, payload);

export const eventFailure: (payload?: any) => IEventAction = (payload?: any): IEventAction => action(EventApiTypes.EVENT_ACTION_FAILURE, payload);

// --- Events

export enum EventsApiTypes {
	EVENTS_ACTION_REQUEST = 'EVENTS_ACTION_REQUEST',
	EVENTS_ACTION_SUCCESS = 'EVENTS_ACTION_SUCCESS',
	EVENTS_ACTION_FAILURE = 'EVENTS_ACTION_FAILURE',
}

export const eventsAction: (payload: IEventsData) => IEventsAction = (payload: IEventsData): IEventsAction =>
	action(EventsApiTypes.EVENTS_ACTION_REQUEST, payload);

export const eventsSuccess: (payload?: any) => IEventsAction = (payload?: any): IEventsAction => action(EventsApiTypes.EVENTS_ACTION_SUCCESS, payload);

export const eventsFailure: (payload?: any) => IEventsAction = (payload?: any): IEventsAction => action(EventsApiTypes.EVENTS_ACTION_FAILURE, payload);

// --- Socket

export enum SocketTypes {
	SOCKET_ACTION = 'SOCKET_ACTION',
}

export const socketAction: (payload: ISocketData) => any = (payload: ISocketData): any => action(SocketTypes.SOCKET_ACTION, payload);

// --- Update Locks

export enum UpdateLocksApiTypes {
	UPDATE_LOCKS_ACTION = 'lock',
	UPDATE_LOCKS_ACTION_SUCCESS = 'UPDATE_LOCKS_ACTION_SUCCESS',
	UPDATE_LOCKS_ACTION_FAILURE = 'UPDATE_LOCKS_ACTION_FAILURE',
}

export const updateLocksAction: (payload: IUpdateLocksData) => IUpdateLocksAction = (payload: IUpdateLocksData): IUpdateLocksAction =>
	socketAction({ event: UpdateLocksApiTypes.UPDATE_LOCKS_ACTION, payload });

export const updateLocksSuccess: (payload?: any) => IUpdateLocksAction = (payload?: any): IUpdateLocksAction =>
	action(UpdateLocksApiTypes.UPDATE_LOCKS_ACTION_SUCCESS, payload);

export const updateLocksFailure: (payload?: any) => IUpdateLocksAction = (payload?: any): IUpdateLocksAction =>
	action(UpdateLocksApiTypes.UPDATE_LOCKS_ACTION_FAILURE, payload);

// --- Update Views

export enum UpdateViewsApiTypes {
	UPDATE_VIEWS_ACTION = 'view',
	UPDATE_VIEWS_ACTION_SUCCESS = 'UPDATE_VIEWS_ACTION_SUCCESS',
	UPDATE_VIEWS_ACTION_FAILURE = 'UPDATE_VIEWS_ACTION_FAILURE',
}

export const updateViewsAction: (payload: IUpdateViewsData) => IUpdateViewsAction = (payload: IUpdateViewsData): IUpdateViewsAction =>
	socketAction({ event: UpdateViewsApiTypes.UPDATE_VIEWS_ACTION, payload });

export const updateViewsSuccess: (payload?: any) => IUpdateViewsAction = (payload?: any): IUpdateViewsAction =>
	action(UpdateViewsApiTypes.UPDATE_VIEWS_ACTION_SUCCESS, payload);

export const updateViewsFailure: (payload?: any) => IUpdateViewsAction = (payload?: any): IUpdateViewsAction =>
	action(UpdateViewsApiTypes.UPDATE_VIEWS_ACTION_FAILURE, payload);

// --- Update Image

export enum UpdateImageApiTypes {
	UPDATE_IMAGE_ACTION = 'update',
	UPDATE_IMAGE_ACTION_SUCCESS = 'UPDATE_IMAGE_ACTION_SUCCESS',
	UPDATE_IMAGE_ACTION_FAILURE = 'UPDATE_IMAGE_ACTION_FAILURE',
}

export const updateImageAction: (payload: IUpdateImageData) => IUpdateImageAction = (payload: IUpdateImageData): IUpdateImageAction =>
	socketAction({ event: UpdateImageApiTypes.UPDATE_IMAGE_ACTION, payload });

export const updateImageSuccess: (payload?: any) => IUpdateImageAction = (payload?: any): IUpdateImageAction =>
	action(UpdateImageApiTypes.UPDATE_IMAGE_ACTION_SUCCESS, payload);

export const updateImageFailure: (payload?: any) => IUpdateImageAction = (payload?: any): IUpdateImageAction =>
	action(UpdateImageApiTypes.UPDATE_IMAGE_ACTION_FAILURE, payload);
