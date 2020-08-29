export type wDw = { width: number; deltaW: number };
export type hDh = { height: number; deltaH: number };
export interface CenterRect {
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	rotateAngle: number;
}

export function getLength(x: number, y: number): number {
	return Math.sqrt(x * x + y * y);
}

export function getAngle({ x: x1, y: y1 }: Partial<DOMPoint>, { x: x2, y: y2 }: Partial<DOMPoint>): number {
	const dot: number = x1 * x2 + y1 * y2;
	const det: number = x1 * y2 - y1 * x2;

	const angle: number = (Math.atan2(det, dot) / Math.PI) * 180;

	return (angle + 360) % 360;
}

export function degToRadian(deg: number): number {
	return (deg * Math.PI) / 180;
}

const cos: (deg: number) => number = (deg: number): number => Math.cos(degToRadian(deg));
const sin: (deg: number) => number = (deg: number): number => Math.sin(degToRadian(deg));

function setWidthAndDeltaW(width: number, deltaW: number, minWidth: number): wDw {
	const expectedWidth: number = width + deltaW;
	if (expectedWidth > minWidth) {
		width = expectedWidth;
	} else {
		deltaW = minWidth - width;
		width = minWidth;
	}
	return { width, deltaW };
}

function setHeightAndDeltaH(height: number, deltaH: number, minHeight: number): hDh {
	const expectedHeight: number = height + deltaH;
	if (expectedHeight > minHeight) {
		height = expectedHeight;
	} else {
		deltaH = minHeight - height;
		height = minHeight;
	}
	return { height, deltaH };
}

export function getNewStyle(type: string, rect: CenterRect, deltaW: number, deltaH: number, ratio: number, minWidth: number, minHeight: number): any {
	let { width, height, centerX, centerY }: CenterRect = rect;
	const { rotateAngle }: CenterRect = rect;

	const widthFlag: number = width < 0 ? -1 : 1;
	const heightFlag: number = height < 0 ? -1 : 1;
	width = Math.abs(width);
	height = Math.abs(height);
	switch (type) {
		case 'r': {
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			if (ratio) {
				deltaH = deltaW / ratio;
				height = width / ratio;
				centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
				centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
			} else {
				centerX += (deltaW / 2) * cos(rotateAngle);
				centerY += (deltaW / 2) * sin(rotateAngle);
			}
			break;
		}
		case 'tr': {
			deltaH = -deltaH;
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				deltaW = deltaH * ratio;
				width = height * ratio;
			}
			centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
			centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
			break;
		}
		case 'br': {
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				deltaW = deltaH * ratio;
				width = height * ratio;
			}
			centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
			centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
			break;
		}
		case 'b': {
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				deltaW = deltaH * ratio;
				width = height * ratio;
				centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
				centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
			} else {
				centerX -= (deltaH / 2) * sin(rotateAngle);
				centerY += (deltaH / 2) * cos(rotateAngle);
			}
			break;
		}
		case 'bl': {
			deltaW = -deltaW;
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				height = width / ratio;
				deltaH = deltaW / ratio;
			}
			centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
			centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
			break;
		}
		case 'l': {
			deltaW = -deltaW;
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			if (ratio) {
				height = width / ratio;
				deltaH = deltaW / ratio;
				centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
				centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
			} else {
				centerX -= (deltaW / 2) * cos(rotateAngle);
				centerY -= (deltaW / 2) * sin(rotateAngle);
			}
			break;
		}
		case 'tl': {
			deltaW = -deltaW;
			deltaH = -deltaH;
			const widthAndDeltaW: wDw = setWidthAndDeltaW(width, deltaW, minWidth);
			width = widthAndDeltaW.width;
			deltaW = widthAndDeltaW.deltaW;
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				width = height * ratio;
				deltaW = deltaH * ratio;
			}
			centerX -= (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
			centerY -= (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
			break;
		}
		case 't': {
			deltaH = -deltaH;
			const heightAndDeltaH: hDh = setHeightAndDeltaH(height, deltaH, minHeight);
			height = heightAndDeltaH.height;
			deltaH = heightAndDeltaH.deltaH;
			if (ratio) {
				width = height * ratio;
				deltaW = deltaH * ratio;

				centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
				centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
			} else {
				centerX += (deltaH / 2) * sin(rotateAngle);
				centerY -= (deltaH / 2) * cos(rotateAngle);
			}
			break;
		}
	}

	return {
		position: {
			centerX,
			centerY,
		},
		size: {
			width: width * widthFlag,
			height: height * heightFlag,
		},
	};
}

const cursorStartMap: { [key: string]: number } = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 };
const cursorDirectionArray: string[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const cursorMap: { [key: number]: number } = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 };

export function getCursor(rotateAngle: number, d: string): string {
	const increment: number = cursorMap[Math.floor(rotateAngle / 30)];
	const index: number = cursorStartMap[d];
	const newIndex: number = (index + increment) % 8;

	return cursorDirectionArray[newIndex];
}

export function centerToTL({ centerX, centerY, width, height, rotateAngle }: CenterRect): any {
	return {
		top: centerY - height / 2,
		left: centerX - width / 2,
		width,
		height,
		rotateAngle,
	};
}

export function tLToCenter({ top, left, width, height, rotateAngle }: CenterRect): any {
	return {
		position: {
			centerX: left + width / 2,
			centerY: top + height / 2,
		},
		size: {
			width,
			height,
		},
		transform: {
			rotateAngle,
		},
	};
}
