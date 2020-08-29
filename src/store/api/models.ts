import { IFile } from '~/models';

export interface IFileData {
	readonly error: string;
	readonly loading: boolean;
	readonly offset: number;
	readonly limit: number;
	readonly total: number;
	readonly files: IFile[];
}

export interface IApiState {
	readonly images?: IFileData;
	readonly locks?: IFileData;
	readonly views?: IFileData;
}

// --- Image

export interface IImageData {
	readonly id: string;
	readonly position: number;
	readonly search?: string;
	readonly filter?: string;
}

export interface IImageAction {
	readonly payload: IImageData;
	readonly type: string;
}

// --- Images

export interface IImagesData {
	readonly offset: number;
	readonly limit: number;
	readonly search?: string;
	readonly filter?: string;
}

export interface IImagesAction {
	readonly payload: IImagesData;
	readonly type: string;
}

// --- Update Locks

export interface ISocketData {
	readonly event: string;
	readonly payload: any;
}

export interface ISocketAction {
	readonly payload: ISocketData;
	readonly type: string;
}

// --- Update Locks

export interface IUpdateLocksData {
	readonly file: IFile;
	readonly bool: boolean;
}

export interface IUpdateLocksAction {
	readonly payload: IUpdateLocksData;
	readonly type: string;
}

// --- Update Views

export interface IUpdateViewsData {
	readonly file: IFile;
	readonly bool: boolean;
}

export interface IUpdateViewsAction {
	readonly payload: IUpdateViewsData;
	readonly type: string;
}

// --- Update image

export type IUpdateImageData = IFile;

export interface IUpdateImageAction {
	readonly payload: IUpdateImageData;
	readonly type: string;
}
