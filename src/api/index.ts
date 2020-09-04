import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { IEventState, IEventsData, IImageData, IImagesData } from '~/store/api/models';
import { EVENT, EVENTS, IMAGE, IMAGES } from '~/api/constants';

const baseURL: string = process.env.API_URL;

const api: AxiosInstance = axios.create({
	baseURL,
	timeout: 30 * 1000,
});

api.interceptors.request.use(
	(config: AxiosRequestConfig): AxiosRequestConfig => {
		config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('token'))}`;

		return config;
	}
);

export const imageApi: (params: IImageData) => Promise<AxiosResponse> = (params: IImageData): Promise<AxiosResponse> => api.get(IMAGE, { params });
export const imagesApi: (params: IImagesData) => Promise<AxiosResponse> = (params: IImagesData): Promise<AxiosResponse> => api.get(IMAGES, { params });

export const eventApi: (params: IEventState) => Promise<AxiosResponse> = (params: IEventState): Promise<AxiosResponse> => api.get(EVENT, { params });
export const eventsApi: (params: IEventsData) => Promise<AxiosResponse> = (params: IEventsData): Promise<AxiosResponse> => api.get(EVENTS, { params });
