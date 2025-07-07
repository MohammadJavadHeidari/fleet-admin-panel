export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  prompt: boolean;
  denied: boolean;
} 