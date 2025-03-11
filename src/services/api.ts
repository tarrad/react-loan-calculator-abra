import { API_CONFIG } from '../config/api';

interface ApiError extends Error {
    status?: number;
    data?: any;
}

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor(baseUrl: string, defaultHeaders: HeadersInit = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            ...API_CONFIG.HEADERS,
            ...defaultHeaders
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error: ApiError = new Error('API request failed');
            error.status = response.status;
            try {
                error.data = await response.json();
            } catch {
                error.data = await response.text();
            }
            throw error;
        }

        try {
            return await response.json();
        } catch (error) {
            throw new Error('Invalid JSON response from server');
        }
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers, like Authorization if needed
                },
                body: JSON.stringify(data),
                
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network request failed');
        }
    }

    // Add other methods (GET, PUT, DELETE) as needed
}

// Create and export a default instance using the config
export const apiClient = new ApiClient(API_CONFIG.BASE_URL); 