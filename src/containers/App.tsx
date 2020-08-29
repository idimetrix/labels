import React, { Component, lazy, LazyExoticComponent, ReactNode, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Footer, Header } from '~/partials/App';
import { IUser, IUserAction } from '~/store/auth/models';
import { getUser } from '~/store/auth/reducer';
import { IRootState } from '~/store/reducer';
import { userAction } from '~/store/auth/actions';

const Home: LazyExoticComponent<any> = lazy((): Promise<any> => import('~/pages/App/Home'));

const About: LazyExoticComponent<any> = lazy((): Promise<any> => import('~/pages/App/About'));

interface IConnectedState {
	readonly user: IUser;
}

interface IConnectedDispatch {
	fetchUser(): void;
}

interface IState {
	[key: string]: any;
}

interface IProps extends RouteComponentProps, IConnectedState, IConnectedDispatch {
	readonly [key: string]: any;
}

const mapStateToProps: (state: IRootState) => IConnectedState = (state: IRootState): IConnectedState => ({
	user: getUser(state.auth),
});

const mapDispatchToProps: (dispatch: Dispatch) => IConnectedDispatch = (dispatch: Dispatch): IConnectedDispatch => ({
	fetchUser: (): IUserAction => dispatch(userAction()),
});

class App extends Component<IProps, IState> {
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
		return (
			<div className="app">
				<Header />
				<div className="main container">
					<Suspense fallback={null}>
						<Switch>
							<Route path="/home" name="Home" component={Home} />
							<Route path="/grid" name="Grid" component={(): any => <Home filter="grid" />} />
							<Route path="/table" name="Table" component={(): any => <Home filter="table" />} />
							<Route path="/about" name="About" component={About} />
							<Redirect from="/" to="/home" exact />
							<Redirect from="*" to="/error/404" />
						</Switch>
					</Suspense>
				</div>
				<Footer />
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
