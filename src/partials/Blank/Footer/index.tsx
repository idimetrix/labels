import React, { Component, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface IProps {
	readonly [key: string]: any;
}

interface IState {
	[key: string]: any;
}

class Footer extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render(): ReactNode {
		return (
			<footer className="footer">
				<div className="container">
					<div className="footer-main">
						<p className="footer-main-title">Labels - IO</p>
						<NavLink to="/blank/grid" className="footer-main-link">
							Grid
						</NavLink>
						<NavLink to="/blank/table" className="footer-main-link">
							Table
						</NavLink>
						<NavLink to="/blank/about" className="footer-main-link">
							About
						</NavLink>
					</div>
				</div>
			</footer>
		);
	}
}
export default Footer;
