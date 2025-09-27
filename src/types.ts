// Launch Data Interface
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

// Component Props Interfaces
export interface LaunchGridProps {
  showFavorites?: boolean;
}

export interface LaunchCardProps {
  launch: LaunchData;
  onViewDetails?: (launch: LaunchData) => void;
  onToggleFavorite?: (launch: LaunchData) => void;
  isFavorite?: boolean;
}
