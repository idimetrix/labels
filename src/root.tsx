import React, { Component, ReactNode } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect, Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Dispatch, Store } from 'redux';
import { ConnectedRouter } from 'connected-react-router';
import { toast, ToastContainer } from 'react-toastify';
import { i18n } from 'element-react';
import locale from 'element-react/src/locale/lang/en';
i18n.use(locale);

import 'element-theme-default';

import { App, Blank, Error } from '~/containers';
import { history } from '~/store';
import { IRootState } from '~/store/reducer';
import { IUser } from '~/store/auth/models';
import { getUser } from '~/store/auth/reducer';
import { Preventer, Tabber } from '~/utils';

toast.configure({
	autoClose: 8000,
	draggable: false,
});

interface IConnectedState {
	readonly user: IUser;
}

interface IConnectedDispatch {
	example: any;
}

interface IState {
	root: boolean;
}

interface IProps extends IConnectedState, IConnectedDispatch {
	readonly store: Store<IRootState, any>;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	user: getUser(state.auth),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	example: null,
});

class Root extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = { root: true };
	}

	public componentDidMount(): void {
		if (process.env.USE_TABBER) {
			Tabber.enable((root: boolean): void => this.setState({ root }));
		}

		console.log('process.env.USE_PREVENTER', process.env.USE_PREVENTER);

		if (process.env.USE_PREVENTER) {
			Preventer.enable();
		}
	}

	public componentWillUnmount(): void {
		if (process.env.USE_TABBER) {
			Tabber.disable();
		}

		if (process.env.USE_PREVENTER) {
			Preventer.disable();
		}
	}

	public render(): ReactNode {
		const { user }: IProps = this.props;
		const { root }: IState = this.state;

		console.log('user', user);

		return root ? (
			<Provider store={this.props.store}>
				<ConnectedRouter history={history}>
					<Switch>
						<Route path="/error" name="Error" component={Error} />
						<Route path="/blank" name="Blank" component={Blank} />
						<Route path="/" name="App" component={App} />
						<Redirect from="*" to="/error/404" />
					</Switch>
				</ConnectedRouter>

				<ToastContainer />
			</Provider>
		) : (
			<div>Please use 1 tab</div>
		);
	}
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
