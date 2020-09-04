import _ from 'lodash';

import { IApiState, IEventState, IFileState } from '~/store/api/models';
import { EventsApiTypes, ImagesApiTypes, UpdateImageApiTypes, UpdateLocksApiTypes, UpdateViewsApiTypes } from '~/store/api/actions';
import { IFile } from '~/models';
import { Mutable } from 'utility-types';

const initialFileData: IFileState = {
	loading: false,
	error: null,
	offset: 0,
	limit: 0,
	total: 0,
	files: [],
};

const initialEventData: IEventState = {
	loading: false,
	error: null,
	offset: 0,
	limit: 0,
	total: 0,
	events: [],
};

const initialState: IApiState = {
	images: { ...initialFileData },
	locks: { ...initialFileData },
	views: { ...initialFileData },
	events: { ...initialEventData },
};

export function reducer(state: IApiState = initialState, action: any): IApiState {
	switch (action.type) {
		// --- Images
		case ImagesApiTypes.IMAGES_ACTION_REQUEST:
			return { ...state, images: { ...state.images, loading: true } };
		case ImagesApiTypes.IMAGES_ACTION_SUCCESS:
			return { ...state, images: { ...action.payload, loading: false, error: null } };
		case ImagesApiTypes.IMAGES_ACTION_FAILURE:
			return { ...state, images: { ...state.images, loading: false, error: action.payload } };

		// --- Events
		case EventsApiTypes.EVENTS_ACTION_REQUEST:
			return { ...state, events: { ...state.events, loading: true } };
		case EventsApiTypes.EVENTS_ACTION_SUCCESS:
			return { ...state, events: { ...action.payload, loading: false, error: null } };
		case EventsApiTypes.EVENTS_ACTION_FAILURE:
			return { ...state, events: { ...state.events, loading: false, error: action.payload } };

		// --- Locks
		case UpdateLocksApiTypes.UPDATE_LOCKS_ACTION_SUCCESS: {
			const file: IFile = action.payload.file;
			const bool: boolean = action.payload.bool;

			const files: IFile[] = state.images.files;

			const index: number = files.findIndex(({ hash }: IFile): boolean => hash === file.hash);

			console.log('action update lock', action, index);

			if (index !== -1) {
				file.locked = bool;

				files[index] = file;

				return { ...state, images: { ...state.images, files: files.slice() } };
			} else {
				return { ...state };
			}
		}

		// --- Views
		case UpdateViewsApiTypes.UPDATE_VIEWS_ACTION_SUCCESS: {
			const file: IFile = action.payload.file;
			const bool: boolean = action.payload.bool;

			const files: IFile[] = state.images.files;

			const index: number = files.findIndex(({ hash }: IFile): boolean => hash === file.hash);

			console.log('action update view', action, index);

			if (index !== -1) {
				file.viewed = bool;

				files[index] = file;

				return { ...state, images: { ...state.images, files: files.slice() } };
			} else {
				return { ...state };
			}
		}

		// --- Image
		case UpdateImageApiTypes.UPDATE_IMAGE_ACTION_SUCCESS: {
			const file: IFile = action.payload;

			const files: IFile[] = state.images.files;

			const index: number = files.findIndex(({ hash }: IFile): boolean => hash === file.hash);

			console.log('action update image', action, index);

			if (index !== -1) {
				files[index] = file;

				return { ...state, images: { ...state.images, files: files.slice() } };
			} else {
				return { ...state };
			}
		}
		default:
			return state;
	}
}

// Selectors

export const getImages: (state: IApiState) => IApiState['images'] = (state: IApiState): IApiState['images'] => state.images;
export const getEvents: (state: IApiState) => IApiState['events'] = (state: IApiState): IApiState['events'] => state.events;
