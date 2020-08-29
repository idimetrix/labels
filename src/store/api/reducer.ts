import { IApiState, IFileData } from '~/store/api/models';
import { ImagesApiTypes, UpdateImageApiTypes, UpdateLocksApiTypes, UpdateViewsApiTypes } from '~/store/api/actions';
import { IFile } from '~/models';

const initialFileData: IFileData = {
	loading: false,
	error: null,
	offset: 0,
	limit: 0,
	count: 0,
	files: [],
};

const initialState: IApiState = {
	images: { ...initialFileData },
	locks: { ...initialFileData },
	views: { ...initialFileData },
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

		// --- Locks
		case UpdateLocksApiTypes.UPDATE_LOCKS_ACTION_SUCCESS: {
			const file: IFile = action.payload.file;
			const bool: boolean = action.payload.bool;

			const files: IFile[] = state.images.files;

			const index: number = files.findIndex(({ id }: IFile): boolean => id === file.id);

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

			const index: number = files.findIndex(({ id }: IFile): boolean => id === file.id);

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

			const index: number = files.findIndex(({ id }: IFile): boolean => id === file.id);

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
