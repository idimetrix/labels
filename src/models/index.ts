export interface IFileMeta {
	part: string;
	quantity: number;
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
	locked: boolean;
	viewed: boolean;
	date: string;
	meta?: IFileMeta;
	boxes?: IFileBox[];
}
