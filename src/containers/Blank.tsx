import React, { Component, lazy, LazyExoticComponent, ReactNode, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Footer, Header } from '~/partials/Blank';
import { IUser, IUserAction } from '~/store/auth/models';
import { getUser } from '~/store/auth/reducer';
import { IRootState } from '~/store/reducer';
import { userAction } from '~/store/auth/actions';

const Home: LazyExoticComponent<any> = lazy((): Promise<any> => import('~/pages/Blank/Home'));

const About: LazyExoticComponent<any> = lazy((): Promise<any> => import('~/pages/Blank/About'));

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

class Blank extends Component<IProps, IState> {
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
							<Route path="/blank/home" name="Home" component={Home} />
							<Route path="/blank/grid" name="Grid" component={(): any => <Home filter="grid" />} />
							<Route path="/blank/table" name="Table" component={(): any => <Home filter="table" />} />
							<Route path="/blank/about" name="About" component={About} />
							<Redirect from="/blank" to="/blank/home" exact />
							<Redirect from="*" to="/error/404" />
						</Switch>
					</Suspense>
				</div>
				<Footer />
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blank));
