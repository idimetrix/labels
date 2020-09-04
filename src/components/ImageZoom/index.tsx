import React, { Component, createRef, HTMLAttributes, ReactNode, RefObject } from 'react';

import cn from 'classnames';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly position: 'left' | 'right' | 'top' | 'bottom' | 'original';
	readonly zoom: boolean;
	readonly scale: number;
}

interface IState {
	[key: string]: any;
}

class ImageZoom extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		position: 'original',
		zoom: true,
		scale: 1,
	};
	public props: IProps;
	public state: IState;

	public container: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
	public wrapper: HTMLDivElement;
	public image: HTMLImageElement;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	// --- hooks

	public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
		if (this.props.zoom && !this.image) {
			this.setup();
		}
	}

	public componentWillUnmount(): void {
		if (this.wrapper) {
			this.wrapper.removeChild(this.image);

			this.container.current.removeChild(this.wrapper);
		}
	}

	public componentDidMount(): void {
		if (this.props.zoom && this.props.children.type === 'img') {
			this.setup();
		}
	}

	public render(): ReactNode {
		return (
			<div
				onMouseOver={this.mouseOver}
				onMouseOut={this.mouseOut}
				onMouseMove={this.mouseMove}
				style={{ display: 'flex', pointerEvents: this.props.zoom ? 'auto' : 'none' }}
				ref={this.container}
				className={cn('position-relative', this.props.className)}
			>
				{this.props.children}
			</div>
		);
	}

	// --- methods

	private mouseOver: (e: MouseEvent) => void = (e: MouseEvent): void => {
		if (!this.image || !this.props.zoom) return;

		this.wrapper.style.display = 'block';

		this.update(e.clientX, e.clientY);
	};

	private mouseOut: (e: MouseEvent) => void = (e: MouseEvent): void => {
		if (!this.image || !this.props.zoom) return;

		this.wrapper.style.display = 'none';
	};

	private mouseMove: (e: MouseEvent) => void = (e: MouseEvent): void => {
		if (!this.image || !this.props.zoom) return;

		this.update(e.clientX, e.clientY);
	};

	private update(clientX: number, clientY: number): void {
		if (!this.image || !this.props.zoom) return;

		const { scale }: IProps = this.props;

		const rect: DOMRect = this.wrapper.getBoundingClientRect();
		const xP: number = (clientX - rect.x) / rect.width;
		const yP: number = (clientY - rect.y) / rect.height;

		const imageWidth: number = this.image.naturalWidth * scale;
		const imageHeight: number = this.image.naturalHeight * scale;

		this.image.style.width = `${imageWidth}px`;
		this.image.style.height = `${imageHeight}px`;

		const imageWidthSection: number = imageWidth - rect.width;
		const imageHeightSection: number = imageHeight - rect.height;

		// console.log(xP, yP, rect)

		this.image.style.left = `-${xP * imageWidthSection}px`;
		this.image.style.top = `-${yP * imageHeightSection}px`;
	}

	private setup(): void {
		this.wrapper = this.container.current.appendChild(document.createElement('div'));
		this.wrapper.style.position = 'absolute';
		this.wrapper.style.overflow = 'hidden';
		this.wrapper.style.width = '100%';
		this.wrapper.style.height = '100%';
		this.wrapper.style.left = '0';
		this.wrapper.style.top = '0';
		this.wrapper.style.display = 'none';

		this.image = this.wrapper.appendChild(this.props.children.ref.current.cloneNode(true));
		this.image.style.position = 'absolute';
		this.image.style.left = '0';
		this.image.style.width = 'auto';
		this.image.style.height = 'auto';
		this.image.style.top = '0';
	}
}

export default ImageZoom;
