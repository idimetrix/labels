import { IFile } from '~/models';

const ASSETS: string = `${process.env.ASSETS_URL}`;

export function getFileUrl(file: IFile): string {
	return `${ASSETS}/${file.name}`;
}
