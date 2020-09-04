import React, { Component, ReactNode } from 'react';
import { hot } from 'react-hot-loader/root';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import { Table, Pagination, Radio, Form, Icon, Loading, Alert, Card, Switch, Slider, Select, Layout, Dialog, Button } from 'element-react';

import { IRootState } from '~/store/reducer';
import { getEvents, getImages } from '~/store/api/reducer';
import {
	IEventsAction,
	IEventsData,
	IFileState,
	IEventState,
	IImagesAction,
	IImagesData,
	IUpdateLocksAction,
	IUpdateLocksData,
	IUpdateViewsAction,
	IUpdateViewsData,
} from '~/store/api/models';
import { eventsAction, imagesAction, updateLocksAction, updateViewsAction } from '~/store/api/actions';
import { IEvent, IFile } from '~/models';
import Boxes from '~/components/Boxes';
import Preview from '~/components/Preview';
import Search from '~/components/Search';
import Meta from '~/components/Meta';
import Nucleus from '~/components/Nucleus';

import { imageApi } from '~/api';
import { forceDownload, getFileUrl } from '~/utils/assets';

interface IConnectedState {
	readonly images: IFileState;
	readonly events: IEventState;
}

interface IConnectedDispatch {
	fetchImages(data?: IImagesData): void;
	fetchEvents(data?: IEventsData): void;
	updateLock(data: IUpdateLocksData): void;
	updateView(data: IUpdateViewsData): void;
}

interface IState {
	columns: ElementReact.TableColumn[];
	currentPage: number;
	search: string;
	view: 'table' | 'grid';
	pageSizes: number[];
	pageSize: number;
	imageSizes: number[];
	imageSize: number;
	settingsDialog: boolean;
	filtersDialog: boolean;
	controls: boolean;
	filters: any;
	event: string;
	preview: IFile;
}

interface IProps extends RouteComponentProps, WithTranslation, IConnectedState, IConnectedDispatch {
	filter?: string;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	images: getImages(state.api),
	events: getEvents(state.api),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	fetchImages: (data?: IImagesData): IImagesAction => dispatch(imagesAction(data)),
	fetchEvents: (data?: IEventsData): IEventsAction => dispatch(eventsAction(data)),
	updateLock: (data: IUpdateLocksData): IUpdateLocksAction => dispatch(updateLocksAction(data)),
	updateView: (data: IUpdateViewsData): IUpdateViewsAction => dispatch(updateViewsAction(data)),
});

class Home extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		const view: string = ['table', 'grid'].includes(props.filter) ? props.filter : 'table';

		const isTable: boolean = view === 'table';
		const isGrid: boolean = view === 'grid';

		this.state = {
			view,
			currentPage: 1,
			search: '',
			pageSizes: [5, 10, 20, 30, 40, 50, 100],
			pageSize: isTable ? 30 : 10,
			imageSizes: [100, 200, 300, 400, 500, 1000],
			imageSize: 400,
			preview: null,
			settingsDialog: false,
			filtersDialog: false,
			controls: true,
			filters: {},
			event: 'default',
			columns: [
				{
					label: '#',
					width: 50,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return (
							<span className="cursor-pointer" onClick={(): void => this.setState({ preview: file })}>
								{file.index + 1}
							</span>
						);
					},
				},
				{
					label: 'Image',
					width: 186,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return (
							<div className="cursor-pointer" onClick={(): void => this.setState({ preview: file })}>
								<Boxes zoom={false} lazy={false} onClick={(): void => this.setState({ preview: file })} width="150px" file={file} />
							</div>
						);
					},
				},
				{
					label: 'Meta',
					width: 120,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return (
							<div>
								<div>Unsure: {file.meta.unsure ? 'yes' : 'no'}</div>
								<div>Occluded: {file.meta.occluded ? 'yes' : 'no'}</div>
								<div>Duplicate: {file.meta.duplicate ? 'yes' : 'no'}</div>
							</div>
						);
					},
				},
				// {
				// 	label: 'Link',
				// 	render: (file: IFile, column?: any, index?: number): ReactNode => {
				// 		return (
				// 			<a style={{ color: 'rgb(72, 87, 106)' }} className="flex p-0" href={getFileUrl(file)} target="_blank">
				// 				{file.name}
				// 			</a>
				// 		);
				// 	},
				// },
				{
					label: 'Date',
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <span>{moment.unix(+file.date).format('LLL')}</span>;
					},
				},
				{
					label: 'Boxes',
					width: 80,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <span>{file?.boxes?.length || 0}</span>;
					},
				},
				{
					label: 'Quantity',
					width: 90,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <span>{file.meta.quantity || 0}</span>;
					},
				},
				{
					label: 'Part',
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <span>{file.meta.part || '-'}</span>;
					},
				},
				{
					label: 'Serial',
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <span>{file.meta.serial || '-'}</span>;
					},
				},
				{
					label: 'Actions',
					minWidth: 100,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return (
							<div className="buttons-group">
								<a style={{ textDecoration: 'none' }} href={getFileUrl(file)} target="_blank" className="el-button el-button--mini">
									link
								</a>
								<Button onClick={(): void => this.setState({ preview: file })} type="" size="mini" className="">
									view
								</Button>
								<a download={file.name} style={{ textDecoration: 'none' }} href={getFileUrl(file)} target="_blank" className="el-button el-button--mini">
									download
								</a>
							</div>
						);
					},
				},
				// {
				// 	label: 'Data',
				// 	minWidth: 350,
				// 	render: (file: IFile, column?: any, index?: number): ReactNode => {
				// 		return <Meta file={file} />;
				// 	},
				// },
				// {
				//   label: 'Actions',
				//   render: (file: IFile, column?: any, index?: number): ReactNode => {
				//     return (<div>Actions</div>);
				//   },
				// },
			],
		};
	}

	// --- hooks

	public componentDidMount(): void {
		this.update();
	}

	public render(): ReactNode {
		const images: IFileState = this.props.images;
		const files: IFile[] = images.files || [];

		return (
			<div className={cn(`page-${this.state.view}`, 'readonly')}>
				<Loading loading={this.props.images.loading} text="Loading..." className="loading">
					{this.renderPreview()}
					{this.renderSettings()}
					{this.renderFilters()}
					{this.renderControls()}
					<div className="m-y-30">
						{files.length ? this.renderView() : !images.loading ? <Alert closable={false} showIcon={true} title="No data found" type="warning" /> : ''}
					</div>
					{this.state.controls && this.renderControls()}
				</Loading>
			</div>
		);
	}

	// --- methods

	private async fetchImage(file: IFile, position: number): Promise<void> {
		const preview: IFile = (await imageApi({ file, position }))?.data;

		this.setState({ preview });
	}

	private update(): void {
		this.props.fetchImages({
			offset: this.state.pageSize * (this.state.currentPage - 1),
			limit: this.state.pageSize,
			search: this.state.search,
			filters: this.state.filters,
			event: this.state.event,
		});

		this.props.fetchEvents({ offset: 0, limit: 100 });
	}

	private renderLoading(): ReactNode {
		const images: IFileState = this.props.images;

		return images.loading ? 'Loading...' : '';
	}

	private renderPreview(): ReactNode {
		const preview: IFile = this.state.preview;
		const files: IFile[] = this.props.images.files;

		return (
			<Preview
				readonly={true}
				onPrev={async (file: IFile): Promise<void> => this.fetchImage(file, -1)}
				onNext={async (file: IFile): Promise<void> => this.fetchImage(file, 1)}
				file={files.find(({ hash }: IFile): boolean => hash === preview?.hash) || preview}
				visible={!!this.state.preview}
				onCancel={(): void => this.setState({ preview: null })}
			/>
		);
	}

	private renderSettings(): ReactNode {
		return (
			<Dialog
				title="Settings"
				size="small"
				visible={this.state.settingsDialog}
				onCancel={(): void => this.setState({ settingsDialog: false })}
				lockScroll={false}
			>
				<Dialog.Body>
					<Form className="demo-form-stacked" labelPosition="left" labelWidth="100">
						<Form.Item label="Layout">
							<Radio.Group size="small" value={this.state.view} onChange={(view: 'table' | 'grid'): void => this.setState({ view })}>
								<Radio.Button value="grid">Grid</Radio.Button>
								<Radio.Button value="table">Table</Radio.Button>
							</Radio.Group>
						</Form.Item>
						<Form.Item label="Image">
							<Select value={this.state.imageSize} onChange={(imageSize: number): void => this.setState({ imageSize })}>
								{this.state.imageSizes.map(
									(size: number): ReactNode => (
										<Select.Option key={size} label={size} value={size} />
									)
								)}
							</Select>
						</Form.Item>
						<Form.Item label="Controls">
							<Switch value={this.state.controls} onChange={(controls: boolean): void => this.setState({ controls })} />
						</Form.Item>
						{/*<Form.Item label="Example">*/}
						{/*  Example*/}
						{/*</Form.Item>*/}
					</Form>
				</Dialog.Body>
			</Dialog>
		);
	}

	private renderFilters(): ReactNode {
		return (
			<Dialog title="Filters" size="small" visible={this.state.filtersDialog} onCancel={(): void => this.setState({ filtersDialog: false })} lockScroll={false}>
				<Dialog.Body>
					<Form className="demo-form-stacked" labelPosition="left" labelWidth="100">
						<Form.Item label="Filters">Filters</Form.Item>
					</Form>
				</Dialog.Body>
			</Dialog>
		);
	}

	private renderControls(): ReactNode {
		return (
			<div className="flex align-center overflow-auto-sm">
				<div className="flex box grow align-center">
					{this.renderPagination()}

					{this.renderEvents()}

					{this.props.images.loading && (
						<span className="flex align-center">
							<Icon name="loading" className="m-l-20 m-r-5" />
							<small>Loading...</small>
						</span>
					)}

					<div>{/*<Slider value={this.state.imageSize} min={100} max={1000} onChange={(imageSize: number): void => this.setState({imageSize})} />*/}</div>
				</div>
				<div className="flex align-center">
					<Search onChange={(search: any): void => this.setState({ search }, (): void => this.update())} />

					{/*<span onClick={(): void => this.setState({ filtersDialog: true })} className="f-s-24 m-l-20 cursor-pointer">*/}
					{/*	<i style={{ color: '#8492a6' }} className="el-icon-edit"></i>*/}
					{/*</span>*/}

					{/*<span onClick={(): void => this.setState({ settingsDialog: true })} className="f-s-24 m-l-20 cursor-pointer">*/}
					{/*	<i style={{ color: '#8492a6' }} className="el-icon-setting"></i>*/}
					{/*</span>*/}
				</div>
			</div>
		);
	}

	private renderView(): ReactNode {
		const images: IFileState = this.props.images;
		const files: IFile[] = images.files || [];

		switch (this.state.view) {
			case 'table':
				return (
					<div>
						<Table className="w-100 f-s-12 responsive-table" showHeader={true} columns={this.state.columns} data={files} border={true} />
					</div>
				);
			case 'grid':
				return (
					<div className="grid readonly">
						{files.map((file: IFile): any => (
							<Nucleus key={file.hash} file={file} onPreview={(): void => this.setState({ preview: file })} />
						))}
					</div>
				);

			default:
				return <div>No view</div>;
		}
	}

	private renderEvents(): ReactNode {
		return this.props?.events?.events ? (
			<Select className="m-l-10" size="small" value={this.state.event} onChange={(event: string): void => this.setState({ event }, (): void => this.update())}>
				{this.props.events.events.map(
					(event: IEvent): ReactNode => (
						<Select.Option key={event.id} label={`${event.name} (${event.size})`} value={event.name} />
					)
				)}
			</Select>
		) : (
			''
		);
	}

	private renderPagination(): ReactNode {
		return (
			<Pagination
				small={false}
				className="p-0"
				onSizeChange={(pageSize: number): void => this.setState({ pageSize, currentPage: 1 }, (): void => this.update())}
				onCurrentChange={(currentPage: number): void => this.setState({ currentPage }, (): void => this.update())}
				layout="total, sizes, prev, pager, next"
				total={this.props.images.total}
				pageSizes={this.state.pageSizes}
				pageSize={this.state.pageSize}
				currentPage={this.state.currentPage}
			/>
		);
	}
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Home)));
