import PropTypes from 'prop-types';
import React, { Component, HTMLAttributes, ReactNode } from 'react';

import Rect from './Rect';
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from './utils';

interface IProps extends HTMLAttributes<HTMLDivElement> {
	readonly [key: string]: any;
}

interface IState {
	[key: string]: any;
}

export default class ResizableRect extends Component<IProps, IState> {
	public static propTypes: any = {
		left: PropTypes.number.isRequired,
		top: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		rotatable: PropTypes.bool,
		draggable: PropTypes.bool,
		rotateAngle: PropTypes.number,
		scale: PropTypes.number,
		parentRotateAngle: PropTypes.number,
		zoomable: PropTypes.string,
		minWidth: PropTypes.number,
		minHeight: PropTypes.number,
		aspectRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
		onRotateStart: PropTypes.func,
		onRotate: PropTypes.func,
		onRotateEnd: PropTypes.func,
		onResizeStart: PropTypes.func,
		onResize: PropTypes.func,
		onResizeEnd: PropTypes.func,
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func,
	};

	public static defaultProps: any = {
		parentRotateAngle: 0,
		rotateAngle: 0,
		scale: 1,
		rotatable: true,
		draggable: true,
		zoomable: '',
		minWidth: 10,
		minHeight: 10,
	};

	public handleRotate = (angle: number, startAngle: number): void => {
		if (!this.props.onRotate) return;

		let rotateAngle: number = Math.round(startAngle + angle);

		if (rotateAngle >= 360) {
			rotateAngle -= 360;
		} else if (rotateAngle < 0) {
			rotateAngle += 360;
		}
		if (rotateAngle > 356 || rotateAngle < 4) {
			rotateAngle = 0;
		} else if (rotateAngle > 86 && rotateAngle < 94) {
			rotateAngle = 90;
		} else if (rotateAngle > 176 && rotateAngle < 184) {
			rotateAngle = 180;
		} else if (rotateAngle > 266 && rotateAngle < 274) {
			rotateAngle = 270;
		}
		this.props.onRotate(rotateAngle);
	};

	public handleResize = (length: number, alpha: number, rect: any, type: string, isShiftKey: boolean): void => {
		if (!this.props.onResize) return;
		const { rotateAngle, aspectRatio, minWidth, minHeight, parentRotateAngle }: any = this.props;

		const scale1: number = 1 / this.props.scale;

		const beta: number = alpha - degToRadian(rotateAngle + parentRotateAngle);
		const deltaW: number = length * Math.cos(beta) * scale1;
		const deltaH: number = length * Math.sin(beta) * scale1;
		const ratio: number = isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio;
		const {
			position: { centerX, centerY },
			size: { width, height },
		}: any = getNewStyle(type, { ...rect, rotateAngle }, deltaW, deltaH, ratio, minWidth, minHeight);

		this.props.onResize(
			centerToTL({
				centerX,
				centerY,
				width,
				height,
				rotateAngle,
			}),
			isShiftKey,
			type
		);
	};

	public handleDrag = (deltaX: number, deltaY: number): void => {
		if (!this.props.onDrag) return;

		const scale1: number = 1 / this.props.scale;

		this.props.onDrag(deltaX * scale1, deltaY * scale1);
	};

	public render(): ReactNode {
		const {
			top,
			left,
			width,
			height,
			rotateAngle,
			parentRotateAngle,
			zoomable,
			draggable,
			rotatable,
			onRotate,
			onResizeStart,
			onResizeEnd,
			onRotateStart,
			onRotateEnd,
			onDragStart,
			onDragEnd,
			scale,
		}: any = this.props;

		const styles: any = tLToCenter({ top, left, width, height, rotateAngle });

		return (
			<Rect
				styles={styles}
				zoomable={zoomable}
				scale={scale}
				draggable={draggable}
				rotatable={Boolean(rotatable && onRotate)}
				parentRotateAngle={parentRotateAngle}
				onResizeStart={onResizeStart}
				onResize={this.handleResize}
				onResizeEnd={onResizeEnd}
				onRotateStart={onRotateStart}
				onRotate={this.handleRotate}
				onRotateEnd={onRotateEnd}
				onDragStart={onDragStart}
				onDrag={this.handleDrag}
				onDragEnd={onDragEnd}
			>
				{this.props.children}
			</Rect>
		);
	}
}
