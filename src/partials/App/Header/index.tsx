import React, { Component, ReactNode } from 'react';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { WithTranslation } from 'react-i18next';
import { Dispatch } from 'redux';

import { IExitAction, IUser } from '~/store/auth/models';
import { IRootState } from '~/store/reducer';
import { getUser } from '~/store/auth/reducer';
import { exitAction } from '~/store/auth/actions';

interface IConnectedState {
	readonly user: IUser;
}

interface IConnectedDispatch {
	exit(): void;
}

interface IProps extends RouteComponentProps, WithTranslation, IConnectedState, IConnectedDispatch {
	readonly [key: string]: any;
}

interface IState {
	[key: string]: any;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	user: getUser(state.auth),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	exit: (): IExitAction => dispatch(exitAction()),
});

class Header extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public render(): ReactNode {
		return (
			<header className="header">
				<div className="container">
					<h1>
						<NavLink to="/home">Labels</NavLink>
					</h1>
					<ul className="nav">
						<li className="nav-item">
							<NavLink to="/grid">Grid</NavLink>
						</li>
						<li className="nav-item">
							<NavLink to="/table">Table</NavLink>
						</li>
					</ul>
				</div>
			</header>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
