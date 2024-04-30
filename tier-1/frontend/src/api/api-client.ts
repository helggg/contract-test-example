import axios, { type AxiosInstance } from 'axios';

export type Post = {
	id: string;
	content: string;
};

export class ApiClient {
	private client: AxiosInstance;

	constructor(baseUrl: string) {
		this.client = axios.create({
			baseURL: baseUrl,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async get<T>(path: string): Promise<T> {
		try {
			const response = await this.client.get<T>(path);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(`HTTP error! status: ${error.response?.status}`, error.message);
				throw new Error(`HTTP error! status: ${error.response?.status}: ${error.message}`);
			} else {
				console.error('Unexpected error: ', error);
				throw new Error('An unexpected error occurred');
			}
		}
	}

	async post<T, R>(path: string, body: T): Promise<R> {
		try {
			const response = await this.client.post<R>(path, body);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(`HTTP error! status: ${error.response?.status}`, error.message);
				throw new Error(`HTTP error! status: ${error.response?.status}: ${error.message}`);
			} else {
				console.error('Unexpected error: ', error);
				throw new Error('An unexpected error occurred');
			}
		}
	}

	async getPosts(): Promise<Post[]> {
		return this.get<Post[]>('/posts');
	}

	async createPost(content: string): Promise<void> {
		return this.post<{ content: string }, void>('/posts', { content });
	}
}

export const apiClient = new ApiClient('http://localhost:8000');
