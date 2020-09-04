import React, { Component, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import LazyLoad from 'react-lazyload';
import { Form, Button, Input, Switch, Loading, InputNumber } from 'element-react';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import _ from 'lodash';
import { Dispatch } from 'redux';

import { IRootState } from '~/store/reducer';
import { IFile } from '~/models';
import {
	IImagesAction,
	IImagesData,
	IUpdateImageAction,
	IUpdateImageData,
	IUpdateLocksAction,
	IUpdateLocksData,
	IUpdateViewsAction,
	IUpdateViewsData,
} from '~/store/api/models';
import { imagesAction, updateImageAction, updateLocksAction, updateViewsAction } from '~/store/api/actions';

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
	readonly readonly: boolean;
	readonly onChange: (newFile: IFile, oldFile: IFile) => void;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	//
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	updateImage: (data: IUpdateImageData): IUpdateImageAction => dispatch(updateImageAction(data)),
	updateViews: (data: IUpdateViewsData): IUpdateViewsAction => dispatch(updateViewsAction(data)),
	updateLocks: (data: IUpdateLocksData): IUpdateLocksAction => dispatch(updateLocksAction(data)),
});

interface IState {
	updater: IFile;
	changed: boolean;
	loading: boolean;
	checks: string[];
}

class Meta extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		file: null,
		readonly: true,
		onChange: (newFile: IFile, oldFile: IFile): void => {
			/**/
		},
	};
	public props: IProps;
	public state: IState;

	private debounce: () => void = _.debounce((): void => this.props.onChange(this.state.updater, this.props.file), 500);

	public constructor(props: IProps) {
		super(props);

		this.state = {
			updater: { ...props.file },
			changed: false,
			loading: false,
			checks: [],
		};
	}

	// --- hooks

	public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
		if (JSON.stringify(prevProps.file) !== JSON.stringify(this.props.file)) {
			this.setState({ updater: { ...this.props.file }, changed: false });

			this.props.updateViews({ file: this.props.file, bool: false });
		}
	}

	public componentWillUnmount(): void {
		if (this.state.changed) {
			this.props.updateViews({ file: this.props.file, bool: false });
		}
	}

	public render(): ReactNode {
		const { readonly }: IProps = this.props;

		return (
			<Loading loading={this.state.loading} className="loading">
				<Form className="demo-form-stacked" labelPosition="left" labelWidth="90">
					{this.builder('input', 'part')}
					{this.builder('input', 'quantity')}
					{this.builder('input', 'serial')}
					<Form.Item style={{ marginBottom: '0' }}>
						{/*<Checkbox.Group value={this.state.checks} onChange={(data: any): void => console.log(data)}>*/}
						{/*  <Checkbox label="Unsure" name="checks" />*/}
						{/*  <Checkbox label="Occluded" name="checks" />*/}
						{/*  <Checkbox label="Duplicate" name="checks" />*/}
						{/*</Checkbox.Group>*/}
						<div className="flex align-center">
							<div className="m-r-10">
								Unsure
								<Switch
									disabled={this.props.file.viewed || readonly}
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={this.state.updater.meta.unsure}
									onChange={(value: boolean): void => this.onChange('unsure', !this.state.updater.meta.unsure)}
								/>
							</div>
							<div className="m-r-10">
								Occluded
								<Switch
									disabled={this.props.file.viewed || readonly}
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={this.state.updater.meta.occluded}
									onChange={(value: boolean): void => this.onChange('occluded', !this.state.updater.meta.occluded)}
								/>
							</div>
							<div className="m-r-20">
								Duplicate
								<Switch
									disabled={this.props.file.viewed || readonly}
									className="m-l-5"
									onText=""
									offText=""
									offValue={false}
									onValue={true}
									value={this.state.updater.meta.duplicate}
									onChange={(value: boolean): void => this.onChange('duplicate', !this.state.updater.meta.duplicate)}
								/>
							</div>

							{this.state.changed && !readonly && (
								<div className="text-nowrap d-none-under-lg">
									<Button size="small" type="primary" onClick={(): void => this.save()}>
										Save
									</Button>
									<Button size="small" onClick={(): void => this.cancel()}>
										Cancel
									</Button>
								</div>
							)}
						</div>
						{this.state.changed && !readonly && (
							<div className="text-nowrap d-block-under-lg d-none-over-lg m-t-22">
								<Button size="small" type="primary" onClick={(): void => this.save()}>
									Save
								</Button>
								<Button size="small" onClick={(): void => this.cancel()}>
									Cancel
								</Button>
							</div>
						)}
					</Form.Item>
				</Form>
			</Loading>
		);
	}

	// --- methods

	private save(): void {
		this.props.updateImage(this.state.updater);

		this.props.onChange(this.state.updater, this.props.file);
	}

	private cancel(): void {
		this.setState({ updater: { ...this.props.file }, changed: false });

		this.props.updateViews({ file: this.props.file, bool: false });
	}

	private onChange(key: string, value: any): void {
		console.log('key', key, 'value', value);

		const updater: IFile = { ...this.state.updater, meta: { ...this.state.updater.meta, [key]: value } };

		const changed: boolean = JSON.stringify(this.props.file) !== JSON.stringify(updater);

		this.props.updateViews({ file: this.props.file, bool: changed });

		this.setState({
			updater,
			changed,
		});
	}

	private builder(type: 'switch' | 'input' | 'number', key: string): ReactNode {
		const { readonly }: IProps = this.props;

		switch (type) {
			case 'switch':
				return (
					<Form.Item label={key.replace(/^./, key[0].toUpperCase())}>
						<Switch
							disabled={this.props.file.viewed || readonly}
							onText=""
							offText=""
							value={this.state.updater.meta[key]}
							onChange={(value: boolean): void => this.onChange(key, !value)}
						/>
					</Form.Item>
				);

			case 'input':
				return (
					<Form.Item label={key.replace(/^./, key[0].toUpperCase())}>
						<Input
							disabled={this.props.file.viewed || readonly}
							size={'small'}
							value={this.state.updater.meta[key]}
							onChange={(value: any): void => this.onChange(key, value)}
						/>
					</Form.Item>
				);

			case 'number':
				return (
					<Form.Item label={key.replace(/^./, key[0].toUpperCase())}>
						<InputNumber
							className="w-100"
							disabled={this.props.file.viewed || readonly}
							size={'small'}
							value={this.state.updater.meta[key] || 0}
							onChange={(value: any): void => this.onChange(key, value)}
						/>
					</Form.Item>
				);
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Meta));
