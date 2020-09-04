import React, { Component, HTMLAttributes, ReactNode } from 'react';
import { Card, Icon, Tag } from 'element-react';
import moment from 'moment';

import Boxes from '~/components/Boxes';
import Circle from '~/components/Circle';
import Tags from '~/components/Tags';

import { IFile } from '~/models';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly file: IFile;
	readonly onPreview: (file: IFile) => void;
}

interface IState {
	[key: string]: any;
}

class Nucleus extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		file: null,
		onPreview: (file: IFile): void => {
			/* */
		},
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
			<Card
				className="nucleus"
				header={
					<div className="flex align-center">
						<div className="flex box grow align-center f-s-14">
							<Icon name="time" className="m-r-10" />
							<span>{moment.unix(+file.date).format('LL LTS')}</span>
							{file.viewed && <Icon name="edit" className="m-l-10" />}
							{file.locked && <Icon name="warning" className="m-l-10" />}
						</div>
						<div>{file.meta.part && <Circle color="green" />}</div>
					</div>
				}
			>
				<div>
					<div className="cursor-pointer" onClick={(): void => this.props.onPreview(file)}>
						<Boxes lazy={false} zoom={false} position="original" width="100%" file={file} />
					</div>

					<Tags className="m-t-10" file={file} />
				</div>
			</Card>
		);
	}
}

export default Nucleus;
