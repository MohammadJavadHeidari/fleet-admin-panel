import type {
  INeshanCoordinates,
  INeshanDirectionRequest,
  INeshanDirectionResponse,
  INeshanReverseGeocodingResponse,
} from 'src/types/neshan';

import axios from 'axios';

// Create a separate axios instance for Neshan API
const neshanAxios = axios.create({
  baseURL: 'https://api.neshan.org',
  timeout: 30000,
});

const NESHAN_API_KEY = 'service.6b8e51466356422a97654934c67dd427';

// Add request interceptor to include API key in headers
neshanAxios.interceptors.request.use((config) => {
  config.headers['api-key'] = NESHAN_API_KEY;
  return config;
});

// Add response interceptor for error handling
neshanAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Neshan API Error:', error);

    // Handle specific Neshan error codes
    if (error.response?.status === 470) {
      throw new Error('Invalid coordinates provided');
    }
    if (error.response?.status === 480) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 481) {
      throw new Error('API usage limit exceeded');
    }
    if (error.response?.status === 482) {
      throw new Error('Rate limit exceeded');
    }
    if (error.response?.status === 483) {
      throw new Error('API key type mismatch');
    }
    if (error.response?.status === 484) {
      throw new Error('API key not whitelisted');
    }
    if (error.response?.status === 485) {
      throw new Error('Service not enabled for this API key');
    }

    throw new Error('Failed to fetch address information');
  }
);

export class NeshanAPI {
  // Reverse geocoding: Convert coordinates to address
  static async reverseGeocode(
    coordinates: INeshanCoordinates
  ): Promise<INeshanReverseGeocodingResponse> {
    try {
      const response = await neshanAxios.get<INeshanReverseGeocodingResponse>(
        `/v5/reverse?lat=${coordinates.lat}&lng=${coordinates.lng}`
      );
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  static async getDirection(params: INeshanDirectionRequest): Promise<INeshanDirectionResponse> {
    try {
      const baseURL = '/v4/direction/no-traffic';

      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        vehicle: params.vehicle || 'car',
        ...(params.waypoints && { waypoints: params.waypoints.join('|') }),
        ...(params.avoidTrafficZone && { avoidTrafficZone: 'true' }),
        ...(params.avoidOddEvenZone && { avoidOddEvenZone: 'true' }),
        ...(params.alternative && { alternative: 'true' }),
      });

      const response = await neshanAxios.get<INeshanDirectionResponse>(`${baseURL}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Direction API failed:', error);
      throw error;
    }
  }
}
