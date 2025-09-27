import axios from 'axios';

export interface LaunchData {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  date_local: string;
  date_unix: number;
  success: boolean | null;
  upcoming: boolean;
  details: string | null;
  failures: Array<{
    time: number;
    altitude: number | null;
    reason: string;
  }>;
  rocket: string;
  launchpad: string;
  payloads: string[];
  crew: string[];
  ships: string[];
  capsules: string[];
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
  fairings: {
    reused: boolean;
    recovery_attempt: boolean;
    recovered: boolean;
    ships: string[];
  };
  cores: Array<{
    core: string;
    flight: number;
    gridfins: boolean;
    legs: boolean;
    reused: boolean;
    landing_attempt: boolean;
    landing_success: boolean | null;
    landing_type: string | null;
    landpad: string | null;
  }>;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  net: boolean;
  window: number;
  tbd: boolean;
  launch_library_id: string | null;
  auto_update: boolean;
}

const SPACEX_API_BASE = 'https://api.spacexdata.com/v4';

// Create axios instance with default config
const spacexApi = axios.create({
  baseURL: SPACEX_API_BASE,
  timeout: 10000,
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
    throw new Error('Failed to fetch SpaceX launches');
  }
};

export const fetchUpcomingLaunches = async (limit: number = 10): Promise<LaunchData[]> => {
  try {
    const response = await spacexApi.get(`/launches/upcoming?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming SpaceX launches:', error);
    throw new Error('Failed to fetch upcoming SpaceX launches');
  }
};

export const fetchPastLaunches = async (limit: number = 10): Promise<LaunchData[]> => {
  try {
    const response = await spacexApi.get(`/launches/past?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching past SpaceX launches:', error);
    throw new Error('Failed to fetch past SpaceX launches');
  }
};

export const fetchLaunchById = async (id: string): Promise<LaunchData> => {
  try {
    const response = await spacexApi.get(`/launches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching launch by ID:', error);
    throw new Error('Failed to fetch launch details');
  }
};

export const fetchLatestLaunch = async (): Promise<LaunchData> => {
  try {
    const response = await spacexApi.get('/launches/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest launch:', error);
    throw new Error('Failed to fetch latest launch');
  }
};

export const fetchNextLaunch = async (): Promise<LaunchData> => {
  try {
    const response = await spacexApi.get('/launches/next');
    return response.data;
  } catch (error) {
    console.error('Error fetching next launch:', error);
    throw new Error('Failed to fetch next launch');
  }
};
