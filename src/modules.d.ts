declare namespace NodeJS {
	export interface ProcessEnv {
		API_URL: string;
		APP_DEBUG: boolean;
		APP_NAME: string;
		APP_URL: string;

		GA: string;
		SENTRY: string;

		USE_TABBER: string;
		USE_PREVENTER: string;
	}
}
