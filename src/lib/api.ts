import axios from 'axios';
import { LaunchData } from '../types';

const SPACEX_API_BASE = 'https://api.spacexdata.com/v4';

// Create axios instance with default config
const spacexApi = axios.create({
  baseURL: SPACEX_API_BASE,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchLaunches = async (limit: number = 10): Promise<LaunchData[]> => {
  try {
    const response = await spacexApi.get(`/launches?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SpaceX launches:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      } else if (error.response && error.response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (error.response && error.response.status >= 500) {
        throw new Error('SpaceX API is currently unavailable. Please try again later.');
      } else {
        throw new Error(`Failed to fetch SpaceX launches: ${error.message}`);
      }
    }
    
    throw new Error('Failed to fetch SpaceX launches. Please try again.');
  }
};
