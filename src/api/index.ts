import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { IImageData, IImagesData } from '~/store/api/models';
import { IMAGE, IMAGES } from '~/api/constants';

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
