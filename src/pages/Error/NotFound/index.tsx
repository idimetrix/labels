import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';

import { IRootState } from '~/store/reducer';
import { IUser, IUserAction } from '~/store/auth/models';
import { getUser } from '~/store/auth/reducer';
import { userAction } from '~/store/auth/actions';

interface IConnectedState {
	readonly user: IUser;
}

interface IConnectedDispatch {
	fetchUser(): void;
}

interface IState {
	example?: any;
}

interface IProps extends RouteComponentProps, WithTranslation, IConnectedState, IConnectedDispatch {
	readonly example?: any;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	user: getUser(state.auth),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	fetchUser: (): IUserAction => dispatch(userAction()),
});

class NotFound extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {};
	}

	public componentDidMount(): void {
		this.props.fetchUser();
	}

	public render(): ReactNode {
		return <div>404 - Page Not Found</div>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(NotFound));
