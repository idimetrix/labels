import { IEvent, IFile } from '~/models';

export interface IFileState {
	readonly error: string;
	readonly loading: boolean;
	readonly offset: number;
	readonly limit: number;
	readonly total: number;
	readonly files: IFile[];
}

export interface IEventState {
	readonly error: string;
	readonly loading: boolean;
	readonly offset: number;
	readonly limit: number;
	readonly total: number;
	readonly events: IEvent[];
}

export interface IApiState {
	readonly images?: IFileState;
	readonly locks?: IFileState;
	readonly views?: IFileState;
	readonly events?: IEventState;
}

// --- Image

export interface IImageData {
	readonly hash: string;
	readonly position: number;
}

export interface IImageAction {
	readonly payload: IImageData;
	readonly type: string;
}

// --- Images

export interface IImagesData {
	readonly offset: number;
	readonly limit: number;
	readonly event: string;
	readonly search?: string;
	readonly filters?: any;
}

export interface IImagesAction {
	readonly payload: IImagesData;
	readonly type: string;
}

// --- Event

export interface IEventData {
	readonly id: string;
}

export interface IEventAction {
	readonly payload: IEventState;
	readonly type: string;
}

// --- Events

export interface IEventsData {
	readonly offset: number;
	readonly limit: number;
	readonly search?: string;
}

export interface IEventsAction {
	readonly payload: IEventsData;
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
