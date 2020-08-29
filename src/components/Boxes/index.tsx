import React, { Component, createRef, HTMLAttributes, ReactNode, RefObject } from 'react';
import cn from 'classnames';
import LazyLoad from 'react-lazyload';
import { Button, Form, Icon, Input, Switch, InputNumber } from 'element-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { IFile, IFileBox } from '~/models';
import { getFileUrl } from '~/utils/assets';
import { IUpdateImageAction, IUpdateImageData, IUpdateLocksAction, IUpdateLocksData, IUpdateViewsAction, IUpdateViewsData } from '~/store/api/models';
import { updateImageAction, updateLocksAction, updateViewsAction } from '~/store/api/actions';
import { IRootState } from '~/store/reducer';
import md5 from '~/utils/md5';
import ResizableRect from '~/components/DragRotateResize';
import ImageZoom from '~/components/ImageZoom';

import styles from './styles.scss';

interface IConnectedState {
	example?: any;
}

interface IConnectedDispatch {
	updateImage(data: IUpdateImageData): void;
	updateViews(data: IUpdateViewsData): void;
	updateLocks(data: IUpdateLocksData): void;
}

interface IProps extends HTMLAttributes<HTMLSpanElement>, WithTranslation, IConnectedState, IConnectedDispatch {
	readonly file: IFile;
	readonly mode?: 'view' | 'edit';
	readonly lazy?: boolean;
	readonly zoom?: boolean;
	readonly link?: boolean;
	readonly width: string;
	readonly height: string;
	readonly position: string;
	readonly onChange: (newFile: IFile, oldFile: IFile) => void;
}

interface IState {
	updater: IFile;
	changed: boolean;
	controls: boolean;
	labels: boolean;
	zoomable: boolean;
	scale: number;
	k: number;
	currentBox: number;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	//
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	updateImage: (data: IUpdateImageData): IUpdateImageAction => dispatch(updateImageAction(data)),
	updateViews: (data: IUpdateViewsData): IUpdateViewsAction => dispatch(updateViewsAction(data)),
	updateLocks: (data: IUpdateLocksData): IUpdateLocksAction => dispatch(updateLocksAction(data)),
});

class Boxes extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		file: null,
		mode: 'view',
		lazy: true,
		zoom: true,
		link: false,
		width: 'auto',
		height: 'auto',
		position: 'right',
		onChange: (newFile: IFile, oldFile: IFile): void => {
			/**/
		},
	};
	public props: IProps;
	public state: IState;

	private timer: number;

	public img: RefObject<HTMLImageElement> = createRef<HTMLImageElement>();

	public constructor(props: IProps) {
		super(props);

		this.state = {
			updater: { ...props.file },
			currentBox: -1,
			changed: false,
			controls: true,
			labels: true,
			zoomable: false,
			scale: 1,
			k: 0,
		};
	}

	// --- hooks

	public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
		if (JSON.stringify(prevProps.file) !== JSON.stringify(this.props.file)) {
			this.setState({ updater: { ...this.props.file }, changed: false, currentBox: -1 });

			this.props.updateViews({ file: this.props.file, bool: false });
		}
	}

	public componentDidMount(): void {
		window.addEventListener('resize', this.resize);

		this.resize();
	}

	public componentWillUnmount(): void {
		if (this.state.changed) {
			this.props.updateViews({ file: this.props.file, bool: false });
		}

		window.removeEventListener('resize', this.resize);
	}

	public render(): ReactNode {
		const { zoom }: IProps = this.props;
		const { updater, currentBox, k, controls, labels, zoomable, scale }: IState = this.state;

		if (!updater) {
			return '';
		}

		const editable: boolean = this.props.mode === 'edit';

		return (
			<div className="position-relative">
				{editable && (
					<div className="flex column m-t-5">
						<div className="flex wrap align-center">
							<div className="m-r-10 m-b-20 flex align-center">
								Controls
								<Switch
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={controls}
									onChange={(): void => this.setState({ controls: !controls })}
								/>
							</div>

							<div className="m-r-10 m-b-20 flex align-center">
								Labels
								<Switch
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={labels}
									onChange={(): void => this.setState({ labels: !labels })}
								/>
							</div>

							<div className="m-r-10 m-b-20 flex align-center">
								Zoomable
								<Switch
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={zoomable}
									onChange={(): void => this.setState({ zoomable: !zoomable })}
								/>
							</div>

							<div className="m-r-10 m-b-20 flex align-center">
								Scale
								<InputNumber
									size="small"
									className="m-l-5"
									defaultValue={scale}
									onChange={(value: number): void => this.setState({ scale: value })}
									step="0.1"
								/>
							</div>
						</div>

						<div className="flex align-center m-b-20">
							<div className="flex box grow align-center">
								<Button className="m-r-5" size="mini" type="success" onClick={(): void => this.addBox()}>
									Add
								</Button>

								{currentBox !== -1 && (
									<Button size="mini" type="danger" onClick={(): void => this.removeBox()}>
										Remove
									</Button>
								)}

								{currentBox !== -1 && (
									<Input
										onChange={(text: string): void => this.onTextChange(text)}
										size="mini"
										className="m-x-10"
										value={this.state.updater.boxes[currentBox].data.text}
										placeholder="Box text..."
									/>
								)}
							</div>
							<div>
								{this.state.changed && (
									<div className="text-nowrap">
										<Button size="mini" type="primary" onClick={(): void => this.save()}>
											Save
										</Button>
										<Button size="mini" onClick={(): void => this.cancel()}>
											Cancel
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="position-relative">
					{k > 0 && !zoomable && (
						<div style={{ left: 0, top: 0, zoom: k }} className="position-absolute w-100 h-100">
							{updater.boxes.map(
								(box: IFileBox, index: number): ReactNode => (
									<ResizableRect
										className="abc"
										scale={k}
										draggable={editable && !zoomable}
										key={box.id}
										left={box.x}
										top={box.y}
										width={box.width}
										height={box.height}
										rotateAngle={box.angle}
										// aspectRatio={false}
										// minWidth={10}
										// minHeight={10}
										zoomable={editable && controls && !zoomable ? 'n, w, s, e, nw, ne, se, sw' : ''}
										rotatable={editable && controls && !zoomable}
										// onRotateStart={this.handleRotateStart}
										onRotate={(angle: number): void => editable && this.handleRotate(index, box, angle)}
										// onRotateEnd={this.handleRotateEnd}
										// onResizeStart={this.handleResizeStart}
										onResize={(style: any, isShiftKey: boolean, type: any): void => editable && this.handleResize(index, box, style, isShiftKey, type)}
										// onResizeEnd={this.handleUp}
										onDragStart={(): void => this.setState({ currentBox: index })}
										onDrag={(deltaX: number, deltaY: number): void => editable && this.handleDrag(index, box, deltaX, deltaY)}
										// onDragEnd={this.handleDragEnd}
									>
										{editable && labels && (box.data.text || '')}
									</ResizableRect>
								)
							)}
						</div>
					)}
					<a href={this.props.link ? getFileUrl(updater) : null} target="_blank" className="flex align-center l-h-1">
						{this.props.lazy ? (
							<LazyLoad
								placeholder={
									<div style={{ textAlign: 'center' }}>
										<Icon name="loading" />
									</div>
								}
							>
								{this.image()}
							</LazyLoad>
						) : (
							this.image()
						)}
					</a>
				</div>
			</div>
		);
	}

	// --- methods

	private addBox(): void {
		const boxes: IFileBox[] = this.state.updater.boxes;

		boxes.push({
			id: `${md5(Math.random().toString())}`,
			x: 100,
			y: 100,
			width: 100,
			height: 100,
			angle: 0,
			data: {
				text: '',
			},
		});

		this.setState({ updater: { ...this.state.updater, boxes }, changed: true });
	}

	private removeBox(): void {
		const boxes: IFileBox[] = this.state.updater.boxes.slice();

		boxes.splice(this.state.currentBox, 1);

		this.setState({ updater: { ...this.state.updater, boxes }, currentBox: -1, changed: true });
	}

	private onTextChange(text: string): void {
		const box: IFileBox = this.state.updater.boxes[this.state.currentBox];

		const boxes: IFileBox[] = this.state.updater.boxes.slice();

		boxes[this.state.currentBox] = { ...box, data: { ...box.data, text } };

		this.setState({ updater: { ...this.state.updater, boxes }, changed: true });
	}

	private save(): void {
		this.props.updateImage(this.state.updater);

		this.props.onChange(this.state.updater, this.props.file);
	}

	private cancel(): void {
		this.setState({ updater: { ...this.props.file }, changed: false, currentBox: -1 });

		this.props.updateViews({ file: this.props.file, bool: false });
	}

	private resize: () => void = (): void => {
		clearTimeout(this.timer);

		if (!this?.img?.current) {
			this.timer = window.setTimeout((): void => this.resize(), 1 * 1000);

			return;
		}

		const img: HTMLImageElement = this.img.current;

		const k: number = img.width / img.naturalWidth;

		this.setState({ k });
	};

	private handleResize(index: number, box: IFileBox, style: any, isShiftKey: boolean, type: any): void {
		const { top: y, left: x, width, height }: any = style;

		const boxes: IFileBox[] = this.state.updater.boxes.slice();

		boxes[index] = { ...box, width, height, x, y };

		this.setState({ updater: { ...this.state.updater, boxes }, changed: true });
	}

	private handleRotate(index: number, box: IFileBox, angle: number): void {
		const boxes: IFileBox[] = this.state.updater.boxes.slice();

		boxes[index] = { ...box, angle };

		this.setState({ updater: { ...this.state.updater, boxes }, changed: true });
	}

	private handleDrag(index: number, box: IFileBox, deltaX: number, deltaY: number): void {
		const boxes: IFileBox[] = this.state.updater.boxes.slice();

		boxes[index] = { ...box, x: box.x + deltaX, y: box.y + deltaY };

		this.setState({ updater: { ...this.state.updater, boxes }, changed: true });
	}

	private image(): ReactNode {
		const { zoomable, scale }: IState = this.state;
		const { width, height, file, zoom, position }: IProps = this.props;

		return (
			<ImageZoom zoom={zoom && zoomable} scale={scale} position={position}>
				<img
					onLoad={(): void => this.resize()}
					onError={(): void => this.resize()}
					ref={this.img}
					style={{ height, width, userSelect: 'none', pointerEvents: 'none', display: 'flex' }}
					src={getFileUrl(file)}
				/>
			</ImageZoom>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Boxes));
