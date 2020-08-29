export interface IUser {
	readonly id: string;
	readonly email: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly name?: string;
	readonly password?: string; // demo only
}

export interface IAuthState {
	readonly error: string;
	readonly loading: boolean;
	readonly token: string;
	readonly user: IUser;
}

// --- Authorization

export interface IAuthorizationData {
	readonly email: string;
	readonly password: string;
	readonly remember?: boolean;
}

export interface IAuthorizationAction {
	readonly payload: IAuthorizationData;
	readonly type: string;
}

// --- Registration

export interface IRegistrationData {
	readonly confirm: string;
	readonly email: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly password: string;
	readonly remember?: boolean;
}

export interface IRegistrationAction {
	readonly payload: IRegistrationData;
	readonly type: string;
}

// --- Exit

export interface IExitData {
	[key: string]: any;
}

export interface IExitAction {
	readonly payload: IExitData;
	readonly type: string;
}

// --- User

export interface IUserData {
	readonly customerId: string;
}

export interface IUserAction {
	readonly payload?: IUserData;
	readonly type: string;
}
