import React, { Component, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import { Badge, Dialog, Form, Icon, Layout, Button, Loading } from 'element-react';
import moment from 'moment';

import { IFile } from '~/models';
import { getFileUrl } from '~/utils/assets';

import Boxes from '~/components/Boxes';
import Meta from '~/components/Meta';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly file: IFile;
	readonly onPrev: (file: IFile) => void;
	readonly onNext: (file: IFile) => void;
	readonly onCancel: () => void;
	readonly visible: boolean;
}

interface IState {
	loading: boolean;
}

class Preview extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		file: null,
		onPrev: (file: IFile): void => {
			/* */
		},
		onNext: (file: IFile): void => {
			/* */
		},
		onCancel: (): void => {
			/* */
		},
		visible: false,
	};
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	public render(): ReactNode {
		const { loading }: IState = this.state;
		const { file }: IProps = this.props;

		return (
			<Dialog size="full" title="Preview" visible={this.props.visible} onCancel={this.props.onCancel}>
				<Dialog.Body>
					<Loading loading={loading}>
						{file && (
							<Layout.Row gutter="20">
								<Layout.Col span="14" md="14" sm="24" xs="24">
									<Boxes position="original" width="100%" file={file} lazy={false} zoom={true} mode="edit" />
								</Layout.Col>
								<Layout.Col span="10" md="10" sm="24" xs="24" className="m-t-20-sm">
									<div className="flex align-center m-b-20 f-s-20">
										<Icon name="time" className="m-r-10" />
										<span>{moment.unix(+file.date).format('LLL')}</span>
										{file.viewed && <Icon name="edit" className="m-l-10" />}
										{file.locked && <Icon name="warning" className="m-l-10" />}
										<a className="el-button el-button--text" href={getFileUrl(file)} target="_blank">
											<Icon name="share" className="m-l-10" />
										</a>
									</div>

									<Meta file={file} />

									<Form className="demo-form-stacked m-t-20" labelPosition="left" labelWidth="100">
										<Form.Item>
											<Layout.Row gutter="20">
												<Layout.Col span="12">
													<Button className="d-block w-100" size="small" onClick={(): void => this.props?.onPrev?.(file)}>
														Prev
													</Button>
												</Layout.Col>
												<Layout.Col span="12">
													<Button className="d-block w-100" size="small" onClick={(): void => this.props?.onNext?.(file)}>
														Next
													</Button>
												</Layout.Col>
											</Layout.Row>
										</Form.Item>
									</Form>
								</Layout.Col>
							</Layout.Row>
						)}
					</Loading>
				</Dialog.Body>
			</Dialog>
		);
	}
}

export default Preview;
