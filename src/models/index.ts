export interface IFileMeta {
	part: string;
	quantity: string;
	serial: string;
	duplicate: boolean;
	occluded: boolean;
	unsure: boolean;
}

export interface IFileBox {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	angle: number;
	data: any;
}

export interface IFile {
	id: string;
	name: string;
	hash: string;
	path: string;
	modified: string;
	sort: string;
	index: number;
	count: number;
	size: number;
	locked: boolean;
	viewed: boolean;
	date: string;
	meta?: IFileMeta;
	boxes?: IFileBox[];
}

export interface IEvent {
	id: string;
	name: string;
	size?: number;
}
