import PropTypes from 'prop-types';
import React, { HTMLAttributes, PureComponent, ReactNode } from 'react';

import { getLength, getAngle, getCursor, CenterRect } from '../utils';
import StyledRect from './StyledRect';

interface IProps extends HTMLAttributes<HTMLDivElement> {
	readonly [key: string]: any;
}

interface IState {
	[key: string]: any;
}

const zoomableMap: { [key: string]: string } = {
	n: 't',
	s: 'b',
	e: 'r',
	w: 'l',
	ne: 'tr',
	nw: 'tl',
	se: 'br',
	sw: 'bl',
};

export default class Rect extends PureComponent<IProps, IState> {
	public static propTypes: any = {
		styles: PropTypes.object,
		zoomable: PropTypes.string,
		scale: PropTypes.number,
		rotatable: PropTypes.bool,
		draggable: PropTypes.bool,
		onResizeStart: PropTypes.func,
		onResize: PropTypes.func,
		onResizeEnd: PropTypes.func,
		onRotateStart: PropTypes.func,
		onRotate: PropTypes.func,
		onRotateEnd: PropTypes.func,
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func,
		parentRotateAngle: PropTypes.number,
	};

	private $element: HTMLDivElement = null;
	private _isMouseDown: boolean = false;

	public setElementRef = (ref: HTMLDivElement): void => {
		this.$element = ref;
	};

	// Drag
	public startDrag = (ev: MouseEvent): void => {
		let { clientX: startX, clientY: startY }: MouseEvent = ev;
		this?.props?.onDragStart?.();
		this._isMouseDown = true;
		const onMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
			if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
			e.stopImmediatePropagation();
			const { clientX, clientY }: MouseEvent = e;
			const deltaX: number = clientX - startX;
			const deltaY: number = clientY - startY;
			this.props.onDrag(deltaX, deltaY);
			startX = clientX;
			startY = clientY;
		};
		const onUp: () => void = (): void => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			if (!this._isMouseDown) return;
			this._isMouseDown = false;
			this?.props?.onDragEnd?.();
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
	};

	// Rotate
	public startRotate = (ev: MouseEvent): void => {
		const scale1: number = 1 / this.props.scale;

		if (ev.button !== 0) return;
		const {
			styles: {
				transform: { rotateAngle: startAngle },
			},
		}: any = this.props;
		const rect: any = this.$element.getBoundingClientRect();
		const center: any = {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		};
		const startVector: any = {
			x: ev.clientX * scale1 - center.x,
			y: ev.clientY * scale1 - center.y,
		};
		this?.props?.onRotateStart?.();
		this._isMouseDown = true;

		const onMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
			if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
			e.stopImmediatePropagation();
			const { clientX, clientY }: MouseEvent = e;
			const rotateVector: any = {
				x: clientX * scale1 - center.x,
				y: clientY * scale1 - center.y,
			};
			const angle: number = getAngle(startVector, rotateVector);
			this?.props?.onRotate?.(angle, startAngle);
		};
		const onUp: () => void = (): void => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			if (!this._isMouseDown) return;
			this._isMouseDown = false;
			this?.props?.onRotateEnd?.();
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
	};

	// Resize
	public startResize = (ev: MouseEvent, cursor: string): void => {
		if (ev.button !== 0) return;
		document.body.style.cursor = cursor;
		const {
			styles: {
				position: { centerX, centerY },
				size: { width, height },
				transform: { rotateAngle },
			},
		}: any = this.props;
		const { clientX: startX, clientY: startY }: MouseEvent = ev;
		const rect: CenterRect = { width, height, centerX, centerY, rotateAngle };
		const type: string = ev.target.getAttribute('class').split(' ')[0];
		this?.props?.onResizeStart?.();
		this._isMouseDown = true;
		const onMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
			if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
			e.stopImmediatePropagation();
			const { clientX, clientY }: MouseEvent = e;
			const deltaX: number = clientX - startX;
			const deltaY: number = clientY - startY;
			const alpha: number = Math.atan2(deltaY, deltaX);
			const deltaL: number = getLength(deltaX, deltaY);
			const isShiftKey: boolean = e.shiftKey;
			this.props.onResize(deltaL, alpha, rect, type, isShiftKey);
		};

		const onUp: () => void = (): void => {
			document.body.style.cursor = 'auto';
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			if (!this._isMouseDown) return;
			this._isMouseDown = false;
			this?.props?.onResizeEnd?.();
		};
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
	};

	public render(): ReactNode {
		const {
			styles: {
				position: { centerX, centerY },
				size: { width, height },
				transform: { rotateAngle },
			},
			zoomable,
			draggable,
			rotatable,
			parentRotateAngle,
		}: any = this.props;

		const style: any = {
			width: Math.abs(width),
			height: Math.abs(height),
			transform: `rotate(${rotateAngle}deg)`,
			left: centerX - Math.abs(width) / 2,
			top: centerY - Math.abs(height) / 2,
			pointerEvents: draggable ? 'auto' : 'none',
		};

		const direction: string[] = zoomable
			.split(',')
			.map((d: string): string => d.trim())
			.filter(Boolean);

		return (
			<StyledRect ref={this.setElementRef} onMouseDown={this.startDrag} className="rect single-resizer" style={style}>
				{rotatable && (
					<div className="rotate" onMouseDown={this.startRotate}>
						{this.iconRotate()}
					</div>
				)}

				{direction.map(
					(d: string): ReactNode => {
						const cursor: string = `${getCursor(rotateAngle + parentRotateAngle, d)}-resize`;
						return (
							<div
								key={d}
								style={{ cursor }}
								className={`${zoomableMap[d]} resizable-handler`}
								onMouseDown={(e: MouseEvent): void => this.startResize(e, cursor)}
							/>
						);
					}
				)}
				{this.props.children}
			</StyledRect>
		);
	}

	private iconRotate(): ReactNode {
		return (
			<svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
					fill="#eb5648"
					fillRule="nonzero"
				/>
			</svg>
		);
	}
}
