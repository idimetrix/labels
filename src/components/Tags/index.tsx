import React, { Component, HTMLAttributes, ReactNode } from 'react';
import { Breadcrumb, Card, Icon, Tag } from 'element-react';
import cn from 'classnames';

import { IFile } from '~/models';
import { getFileUrl } from '~/utils/assets';

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
			<div className={cn('tags', this.props.className)}>
				<div className="flex align-center f-s-12">
					<a style={{ color: '#48576a' }} className="flex box grow f-s-12 p-0" href={getFileUrl(file)} target="_blank">
						{file.name}
					</a>
					<span className="m-l-5"> {`${file.index + 1} of ${file.count}`}</span>
				</div>
				<div className="m-t-10">
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
