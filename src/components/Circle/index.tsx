import React, { Component, HTMLAttributes, ReactNode } from 'react';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly color: string;
	readonly size: number;
}

interface IState {
	[key: string]: any;
}

class Circle extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		color: '#000',
		size: 10,
	};
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render(): ReactNode {
		const { size, color }: IProps = this.props;

		return <div style={{ background: color, borderRadius: `${size}px`, width: `${size}px`, height: `${size}px` }}>{this.props.children}</div>;
	}
}

export default Circle;
