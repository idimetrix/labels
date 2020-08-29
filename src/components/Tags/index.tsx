import React, { Component, HTMLAttributes, ReactNode } from 'react';
import { Breadcrumb, Card, Icon, Tag } from 'element-react';

import { IFile } from '~/models';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly file: IFile;
}

interface IState {
	[key: string]: any;
}

class Tags extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		file: null,
	};
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render(): ReactNode {
		const { file }: IProps = this.props;

		return (
			<div>
				<div>
					<Tag className="m-r-5" type={file.meta.unsure ? '' : 'gray'}>
						unsure
					</Tag>
					<Tag className="m-r-5" type={file.meta.duplicate ? '' : 'gray'}>
						duplicate
					</Tag>
					<Tag className="m-r-5" type={file.meta.occluded ? '' : 'gray'}>
						occluded
					</Tag>
				</div>
				<div className="m-t-5 f-s-12">
					<Breadcrumb separator="/">
						<Breadcrumb.Item className="m-t-5">part: {file.meta.part || '-'}</Breadcrumb.Item>
						<Breadcrumb.Item className="m-t-5">quantity: {file.meta.quantity || '-'}</Breadcrumb.Item>
						<Breadcrumb.Item className="m-t-5">serial: {file.meta.serial || '-'}</Breadcrumb.Item>
						<Breadcrumb.Item className="m-t-5">
							<span style={{ color: '#48576a' }}>
								<Icon name="picture" /> {file?.boxes?.length || 0}
							</span>
						</Breadcrumb.Item>
					</Breadcrumb>
				</div>
			</div>
		);
	}
}

export default Tags;
