import { action } from 'typesafe-actions';

import { IAuthorizationAction, IAuthorizationData, IExitAction, IRegistrationAction, IRegistrationData, IUserAction, IUserData } from './models';

// --- Authorization

export enum AuthorizationActionsTypes {
	AUTHORIZATION_ACTION_REQUEST = 'AUTHORIZATION_ACTION_REQUEST',
	AUTHORIZATION_ACTION_SUCCESS = 'AUTHORIZATION_ACTION_SUCCESS',
	AUTHORIZATION_ACTION_FAILURE = 'AUTHORIZATION_ACTION_FAILURE',
}

export const authorizationAction: (payload: IAuthorizationData) => IAuthorizationAction = (payload: IAuthorizationData): IAuthorizationAction =>
	action(AuthorizationActionsTypes.AUTHORIZATION_ACTION_REQUEST, payload);

export const authorizationSuccess: (payload?: any) => IAuthorizationAction = (payload?: any): IAuthorizationAction =>
	action(AuthorizationActionsTypes.AUTHORIZATION_ACTION_SUCCESS, payload);

export const authorizationFailure: (payload?: any) => IAuthorizationAction = (payload?: any): IAuthorizationAction =>
	action(AuthorizationActionsTypes.AUTHORIZATION_ACTION_FAILURE, payload);

// --- Registration

export enum RegistrationActionsTypes {
	REGISTRATION_ACTION_REQUEST = 'REGISTRATION_ACTION_REQUEST',
	REGISTRATION_ACTION_SUCCESS = 'REGISTRATION_ACTION_SUCCESS',
	REGISTRATION_ACTION_FAILURE = 'REGISTRATION_ACTION_FAILURE',
}

export const registrationAction: (payload: IRegistrationData) => IRegistrationAction = (payload: IRegistrationData): IRegistrationAction =>
	action(RegistrationActionsTypes.REGISTRATION_ACTION_REQUEST, payload);

export const registrationSuccess: (payload?: any) => IRegistrationAction = (payload?: any): IRegistrationAction =>
	action(RegistrationActionsTypes.REGISTRATION_ACTION_SUCCESS, payload);

export const registrationFailure: (payload?: any) => IRegistrationAction = (payload?: any): IRegistrationAction =>
	action(RegistrationActionsTypes.REGISTRATION_ACTION_FAILURE, payload);

// --- exit

export enum ExitActionsTypes {
	EXIT_ACTION_REQUEST = 'EXIT_ACTION_REQUEST',
	EXIT_ACTION_SUCCESS = 'EXIT_ACTION_SUCCESS',
	EXIT_ACTION_FAILURE = 'EXIT_ACTION_FAILURE',
}

export const exitAction: () => IExitAction = (): IExitAction => action(ExitActionsTypes.EXIT_ACTION_REQUEST, {});

export const exitSuccess: (payload?: any) => IExitAction = (payload?: any): IExitAction => action(ExitActionsTypes.EXIT_ACTION_SUCCESS, payload);

export const exitFailure: (payload?: any) => IExitAction = (payload?: any): IExitAction => action(ExitActionsTypes.EXIT_ACTION_FAILURE, payload);

// --- user

export enum UserActionsTypes {
	USER_ACTION_REQUEST = 'USER_ACTION_REQUEST',
	USER_ACTION_SUCCESS = 'USER_ACTION_SUCCESS',
	USER_ACTION_FAILURE = 'USER_ACTION_FAILURE',
}

export const userAction: (payload?: IUserData) => IUserAction = (payload?: IUserData): IUserAction => action(UserActionsTypes.USER_ACTION_REQUEST, payload);

export const userSuccess: (payload?: any) => IUserAction = (payload?: any): IUserAction => action(UserActionsTypes.USER_ACTION_SUCCESS, payload);

export const userFailure: (payload?: any) => IUserAction = (payload?: any): IUserAction => action(UserActionsTypes.USER_ACTION_FAILURE, payload);
