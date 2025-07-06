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