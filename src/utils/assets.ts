import { IFile } from '~/models';
import { rejects } from 'assert';

const ASSETS: string = `${process.env.ASSETS_URL}`;

export function getFileUrl(file: IFile): string {
	return `${ASSETS}/${file.path}`;
}

export async function forceDownload(url: string, name: string): Promise<void> {
	return new Promise((resolve: () => void, reject: (e?: Error) => void): void => {
		const xhr: XMLHttpRequest = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function (): void {
			const urlCreator: any = window.URL || window.webkitURL;
			const tag: HTMLAnchorElement = document.createElement('a');
			tag.href = urlCreator.createObjectURL(this.response);
			tag.download = name;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);

			resolve();
		};
		xhr.onerror = (): void => {
			rejects(null);
		};
		xhr.send();
	});
}
