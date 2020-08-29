import React, { Component, ReactNode } from 'react';
import { hot } from 'react-hot-loader/root';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import { Table, Pagination, Radio, Form, Icon, Loading, Alert, Card, Switch, Slider, Select, Layout, Dialog } from 'element-react';

import { IRootState } from '~/store/reducer';
import { getImages } from '~/store/api/reducer';
import { IFileData, IImagesAction, IImagesData, IUpdateLocksAction, IUpdateLocksData, IUpdateViewsAction, IUpdateViewsData } from '~/store/api/models';
import { imagesAction, updateLocksAction, updateViewsAction } from '~/store/api/actions';
import { IFile } from '~/models';
import Boxes from '~/components/Boxes';
import Preview from '~/components/Preview';
import Search from '~/components/Search';
import Meta from '~/components/Meta';
import Nucleus from '~/components/Nucleus';
import { imageApi } from '~/api';

import styles from './styles.scss';

interface IConnectedState {
	readonly images: IFileData;
}

interface IConnectedDispatch {
	fetchImages(data?: IImagesData): void;
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
	settings: boolean;
	controls: boolean;
	preview: IFile;
}

interface IProps extends RouteComponentProps, WithTranslation, IConnectedState, IConnectedDispatch {
	filter?: string;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	images: getImages(state.api),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	fetchImages: (data?: IImagesData): IImagesAction => dispatch(imagesAction(data)),
	updateLock: (data: IUpdateLocksData): IUpdateLocksAction => dispatch(updateLocksAction(data)),
	updateView: (data: IUpdateViewsData): IUpdateViewsAction => dispatch(updateViewsAction(data)),
});

class Home extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			view: ['table', 'grid'].includes(props.filter) ? props.filter : 'grid',
			currentPage: 1,
			search: '',
			pageSizes: [5, 10, 20, 30, 40, 50, 100],
			pageSize: 10,
			imageSizes: [100, 200, 300, 400, 500, 1000],
			imageSize: 400,
			preview: null,
			settings: false,
			controls: true,
			columns: [
				{
					label: 'Image',
					minWidth: 350,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return (
							<div className="flex align-center column">
								<div className="cursor-pointer" onClick={(): void => this.setState({ preview: file })}>
									<Boxes zoom={false} onClick={(): void => this.setState({ preview: file })} width={`${this.state.imageSize}px`} file={file} />
								</div>

								<div className="m-t-10">
									<Icon name="time" className="m-r-10" />
									<span>{moment.unix(+file.date).format('LLL')}</span>
									{file.viewed && <Icon name="edit" className="m-l-10" />}
									{file.locked && <Icon name="warning" className="m-l-10" />}
								</div>
							</div>
						);
					},
				},
				{
					label: 'Data',
					minWidth: 350,
					render: (file: IFile, column?: any, index?: number): ReactNode => {
						return <Meta file={file} />;
					},
				},
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
		const images: IFileData = this.props.images;
		const files: IFile[] = images.files || [];

		return (
			<div>
				<Loading loading={this.props.images.loading} text="Loading..." className="loading">
					{/*<pre>{JSON.stringify(this.props.images.files, null, 2)}</pre>*/}
					{/*{this.renderLoading()}*/}
					{this.renderPreview()}
					{this.renderSettings()}
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
		const preview: IFile = (await imageApi({ id: file.id, position }))?.data;

		this.setState({ preview });
	}

	private update(): void {
		this.props.fetchImages({
			offset: this.state.pageSize * (this.state.currentPage - 1),
			limit: this.state.pageSize,
			search: this.state.search,
			filter: this.props.filter,
		});
	}

	private renderLoading(): ReactNode {
		const images: IFileData = this.props.images;

		return images.loading ? 'Loading...' : '';
	}

	private renderPreview(): ReactNode {
		const preview: IFile = this.state.preview;
		const files: IFile[] = this.props.images.files;

		return (
			<Preview
				onPrev={async (file: IFile): Promise<void> => this.fetchImage(file, -1)}
				onNext={async (file: IFile): Promise<void> => this.fetchImage(file, 1)}
				file={files.find(({ id }: IFile): boolean => id === preview?.id) || preview}
				visible={!!this.state.preview}
				onCancel={(): void => this.setState({ preview: null })}
			/>
		);
	}

	private renderSettings(): ReactNode {
		return (
			<Dialog title="Settings" size="small" visible={this.state.settings} onCancel={(): void => this.setState({ settings: false })} lockScroll={false}>
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

	private renderControls(): ReactNode {
		return (
			<div className="flex align-center overflow-auto">
				<div className="flex box grow align-center">
					{this.renderPagination()}

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

					<span onClick={(): void => this.setState({ settings: true })} className="f-s-24 m-l-20 cursor-pointer">
						<i style={{ color: '#8492a6' }} className="el-icon-setting"></i>
					</span>
				</div>
			</div>
		);
	}

	private renderView(): ReactNode {
		const images: IFileData = this.props.images;
		const files: IFile[] = images.files || [];

		switch (this.state.view) {
			case 'table':
				return (
					<div>
						<Table className="w-100 responsive-table" showHeader={false} columns={this.state.columns} data={files} border={true} />
					</div>
				);
			case 'grid':
				return (
					<div className="grid">
						{files.map((file: IFile): any => (
							<Nucleus key={file.id} file={file} onPreview={(): void => this.setState({ preview: file })} />
						))}
					</div>
				);

			default:
				return <div>No view</div>;
		}
	}

	private renderPagination(): ReactNode {
		return (
			<Pagination
				className="p-0"
				onSizeChange={(pageSize: number): void => this.setState({ pageSize, currentPage: 1 }, (): void => this.update())}
				onCurrentChange={(currentPage: number): void => this.setState({ currentPage }, (): void => this.update())}
				layout="total, sizes, prev, pager, next, jumper"
				total={this.props.images.total}
				pageSizes={this.state.pageSizes}
				pageSize={this.state.pageSize}
				currentPage={this.state.currentPage}
			/>
		);
	}
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Home)));
