export interface INeshanReverseGeocodingResponse {
  status: string;
  formatted_address: string;
  route_name: string;
  route_type: string;
  neighbourhood: string;
  city: string;
  state: string;
  place: string;
  municipality_zone: string;
  in_traffic_zone: boolean;
  in_odd_even_zone: boolean;
  village: string;
  county: string;
  district: string;
}

export interface INeshanCoordinates {
  lat: number;
  lng: number;
}

export interface INeshanDirectionResponse {
  routes: Array<{
    overview_polyline: {
      points: string;
    };
    legs: Array<{
      summary: string;
      distance: {
        value: number;
        text: string;
      };
      duration: {
        value: number;
        text: string;
      };
      steps: Array<{
        name: string;
        instruction: string;
        bearing_after: number;
        type: string;
        modifier?: string;
        exit?: number;
        distance: {
          value: number;
          text: string;
        };
        duration: {
          value: number;
          text: string;
        };
        polyline: string;
        start_location: [number, number]; // [lng, lat]
      }>;
    }>;
  }>;
}

export interface INeshanDirectionRequest {
  origin: string; // "lat,lng" format
  destination: string; // "lat,lng" format
  waypoints?: string[]; // Array of "lat,lng" waypoints
  vehicle?: 'car' | 'motorcycle'; // Default: car
  avoidTrafficZone?: boolean;
  avoidOddEvenZone?: boolean;
  alternative?: boolean;
}
