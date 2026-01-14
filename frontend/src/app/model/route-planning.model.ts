export interface Location {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type?: 'start' | 'end' | 'waypoint';
}

export interface Waypoint extends Location {
  order: number;
  estimatedArrival?: Date;
  stopDuration?: number; // in minutes
}

export interface RouteSegment {
  from: Location;
  to: Location;
  distance: number; // in kilometers
  duration: number; // in minutes
  trafficDelay?: number; // additional minutes due to traffic
  polyline: string; // encoded polyline for map display
  instructions: RouteInstruction[];
}

export interface RouteInstruction {
  text: string;
  distance: number;
  duration: number;
  maneuver: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface PlannedRoute {
  id: string;
  name?: string;
  startLocation: Location;
  endLocation: Location;
  waypoints: Waypoint[];
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  totalTrafficDelay: number;
  estimatedArrival: Date;
  createdAt: Date;
  updatedAt: Date;
  isOptimized: boolean;
}

export interface AlternativeRoute {
  route: PlannedRoute;
  reason: string; // 'fastest', 'shortest', 'avoid_traffic', 'scenic'
  savings: {
    time?: number;
    distance?: number;
    fuel?: number;
  };
}

export interface TrafficInfo {
  severity: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
  delay: number; // in minutes
  location: Location;
  affectedSegments: string[]; // segment IDs
}

export interface RoutePreferences {
  avoidTolls: boolean;
  avoidHighways: boolean;
  avoidFerries: boolean;
  preferFastestRoute: boolean;
  preferShortestRoute: boolean;
  vehicleType: 'car' | 'bus' | 'truck' | 'motorcycle';
}

export interface GeocodeResult {
  address: string;
  location: Location;
  confidence: number;
  type: 'exact' | 'approximate' | 'partial';
}

export interface RoutePlanningRequest {
  startLocation: Location;
  endLocation: Location;
  waypoints?: Waypoint[];
  preferences: RoutePreferences;
  departureTime?: Date;
  optimizeWaypoints?: boolean;
}

export interface RoutePlanningResponse {
  primaryRoute: PlannedRoute;
  alternativeRoutes: AlternativeRoute[];
  trafficInfo: TrafficInfo[];
  warnings: string[];
}