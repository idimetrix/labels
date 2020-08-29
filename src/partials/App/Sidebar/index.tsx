import React, { Component, ReactNode } from 'react';

interface IProps {
	readonly [key: string]: any;
}

interface IState {
	isOpen: boolean;
}

class Sidebar extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			isOpen: false,
		};
	}

	public render(): ReactNode {
		// Const { isOpen } = this.state;

		return <nav>Nav</nav>;
	}

	// public toggle(): void {
	// 	Const { isOpen } = this.state;
	//
	// 	This.setState({ isOpen: !isOpen });
	// }
}

export default Sidebar;
