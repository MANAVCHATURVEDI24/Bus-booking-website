import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, interval } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  Location,
  Waypoint,
  PlannedRoute,
  AlternativeRoute,
  TrafficInfo,
  RoutePreferences,
  GeocodeResult,
  RoutePlanningRequest,
  RoutePlanningResponse,
  RouteSegment,
  RouteInstruction
} from '../model/route-planning.model';

@Injectable({
  providedIn: 'root'
})
export class RoutePlanningService {
  private baseUrl = 'http://localhost:5001/api/routes';
  
  // For demo purposes, we'll use mock data. In production, integrate with Google Maps, Mapbox, or OpenStreetMap
  private currentRouteSubject = new BehaviorSubject<PlannedRoute | null>(null);
  public currentRoute$ = this.currentRouteSubject.asObservable();
  
  private trafficUpdatesSubject = new BehaviorSubject<TrafficInfo[]>([]);
  public trafficUpdates$ = this.trafficUpdatesSubject.asObservable();

  // Mock Indian cities data
  private mockCities: Location[] = [
    { id: '1', name: 'Mumbai', address: 'Mumbai, Maharashtra, India', latitude: 19.0760, longitude: 72.8777 },
    { id: '2', name: 'Delhi', address: 'New Delhi, Delhi, India', latitude: 28.6139, longitude: 77.2090 },
    { id: '3', name: 'Bangalore', address: 'Bangalore, Karnataka, India', latitude: 12.9716, longitude: 77.5946 },
    { id: '4', name: 'Chennai', address: 'Chennai, Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707 },
    { id: '5', name: 'Kolkata', address: 'Kolkata, West Bengal, India', latitude: 22.5726, longitude: 88.3639 },
    { id: '6', name: 'Hyderabad', address: 'Hyderabad, Telangana, India', latitude: 17.3850, longitude: 78.4867 },
    { id: '7', name: 'Pune', address: 'Pune, Maharashtra, India', latitude: 18.5204, longitude: 73.8567 },
    { id: '8', name: 'Ahmedabad', address: 'Ahmedabad, Gujarat, India', latitude: 23.0225, longitude: 72.5714 },
    { id: '9', name: 'Jaipur', address: 'Jaipur, Rajasthan, India', latitude: 26.9124, longitude: 75.7873 },
    { id: '10', name: 'Surat', address: 'Surat, Gujarat, India', latitude: 21.1702, longitude: 72.8311 }
  ];

  constructor(private http: HttpClient) {
    // Start real-time traffic updates simulation
    this.startTrafficUpdates();
  }

  // Geocoding - Search for locations
  searchLocations(query: string): Observable<GeocodeResult[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    // Mock implementation - filter cities by query
    const filteredCities = this.mockCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.address.toLowerCase().includes(query.toLowerCase())
    );

    const results: GeocodeResult[] = filteredCities.map(city => ({
      address: city.address,
      location: city,
      confidence: city.name.toLowerCase().startsWith(query.toLowerCase()) ? 1.0 : 0.8,
      type: 'exact' as const
    }));

    return of(results);

    // Real API implementation would be:
    // const params = new HttpParams().set('query', query);
    // return this.http.get<GeocodeResult[]>(`${this.baseUrl}/geocode`, { params });
  }

  // Reverse geocoding - Get address from coordinates
  reverseGeocode(latitude: number, longitude: number): Observable<GeocodeResult> {
    // Mock implementation
    const nearestCity = this.findNearestCity(latitude, longitude);
    const result: GeocodeResult = {
      address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      location: {
        id: Date.now().toString(),
        name: 'Custom Location',
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        latitude,
        longitude
      },
      confidence: 0.9,
      type: 'approximate'
    };

    if (nearestCity) {
      result.address = `Near ${nearestCity.name}`;
      result.location.name = `Near ${nearestCity.name}`;
    }

    return of(result);

    // Real API implementation would be:
    // const params = new HttpParams()
    //   .set('lat', latitude.toString())
    //   .set('lng', longitude.toString());
    // return this.http.get<GeocodeResult>(`${this.baseUrl}/reverse-geocode`, { params });
  }

  // Plan route with waypoints
  planRoute(request: RoutePlanningRequest): Observable<RoutePlanningResponse> {
    // Mock implementation
    const primaryRoute = this.generateMockRoute(request);
    const alternativeRoutes = this.generateAlternativeRoutes(request, primaryRoute);
    const trafficInfo = this.generateMockTrafficInfo(primaryRoute);

    const response: RoutePlanningResponse = {
      primaryRoute,
      alternativeRoutes,
      trafficInfo,
      warnings: []
    };

    // Add warnings based on route conditions
    if (primaryRoute.totalDistance > 500) {
      response.warnings.push('Long distance journey - consider rest stops');
    }
    if (trafficInfo.some(t => t.severity === 'high' || t.severity === 'severe')) {
      response.warnings.push('Heavy traffic detected on route');
    }

    this.currentRouteSubject.next(primaryRoute);
    return of(response);

    // Real API implementation would be:
    // return this.http.post<RoutePlanningResponse>(`${this.baseUrl}/plan`, request);
  }

  // Optimize waypoints order
  optimizeWaypoints(route: PlannedRoute): Observable<PlannedRoute> {
    // Mock optimization - sort waypoints by distance from start
    const optimizedWaypoints = [...route.waypoints].sort((a, b) => {
      const distA = this.calculateDistance(route.startLocation, a);
      const distB = this.calculateDistance(route.startLocation, b);
      return distA - distB;
    });

    // Update order
    optimizedWaypoints.forEach((waypoint, index) => {
      waypoint.order = index + 1;
    });

    const optimizedRoute: PlannedRoute = {
      ...route,
      waypoints: optimizedWaypoints,
      isOptimized: true,
      updatedAt: new Date()
    };

    // Recalculate segments and totals
    this.recalculateRoute(optimizedRoute);
    
    this.currentRouteSubject.next(optimizedRoute);
    return of(optimizedRoute);

    // Real API implementation would be:
    // return this.http.post<PlannedRoute>(`${this.baseUrl}/optimize`, { routeId: route.id });
  }

  // Add waypoint to existing route
  addWaypoint(route: PlannedRoute, waypoint: Waypoint): Observable<PlannedRoute> {
    const updatedWaypoints = [...route.waypoints, waypoint].sort((a, b) => a.order - b.order);
    
    const updatedRoute: PlannedRoute = {
      ...route,
      waypoints: updatedWaypoints,
      updatedAt: new Date()
    };

    this.recalculateRoute(updatedRoute);
    this.currentRouteSubject.next(updatedRoute);
    return of(updatedRoute);
  }

  // Remove waypoint from route
  removeWaypoint(route: PlannedRoute, waypointId: string): Observable<PlannedRoute> {
    const updatedWaypoints = route.waypoints.filter(w => w.id !== waypointId);
    
    // Reorder remaining waypoints
    updatedWaypoints.forEach((waypoint, index) => {
      waypoint.order = index + 1;
    });

    const updatedRoute: PlannedRoute = {
      ...route,
      waypoints: updatedWaypoints,
      updatedAt: new Date()
    };

    this.recalculateRoute(updatedRoute);
    this.currentRouteSubject.next(updatedRoute);
    return of(updatedRoute);
  }

  // Get real-time traffic updates
  getTrafficUpdates(route: PlannedRoute): Observable<TrafficInfo[]> {
    return this.trafficUpdates$.pipe(
      map(allTraffic => allTraffic.filter(traffic => 
        this.isTrafficRelevantToRoute(traffic, route)
      ))
    );
  }

  // Save route for later use
  saveRoute(route: PlannedRoute, name: string): Observable<PlannedRoute> {
    const savedRoute: PlannedRoute = {
      ...route,
      name,
      updatedAt: new Date()
    };

    // In real implementation, save to backend
    localStorage.setItem(`saved_route_${route.id}`, JSON.stringify(savedRoute));
    
    return of(savedRoute);
  }

  // Get saved routes
  getSavedRoutes(): Observable<PlannedRoute[]> {
    const savedRoutes: PlannedRoute[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('saved_route_')) {
        try {
          const route = JSON.parse(localStorage.getItem(key) || '');
          savedRoutes.push(route);
        } catch (error) {
          console.error('Error parsing saved route:', error);
        }
      }
    }

    return of(savedRoutes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));
  }

  // Private helper methods
  private generateMockRoute(request: RoutePlanningRequest): PlannedRoute {
    const segments: RouteSegment[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    // Create segments between all points
    const allPoints = [request.startLocation, ...(request.waypoints || []), request.endLocation];
    
    for (let i = 0; i < allPoints.length - 1; i++) {
      const from = allPoints[i];
      const to = allPoints[i + 1];
      const distance = this.calculateDistance(from, to);
      const duration = this.calculateDuration(distance, request.preferences.vehicleType);
      
      const segment: RouteSegment = {
        from,
        to,
        distance,
        duration,
        trafficDelay: Math.random() * 15, // Random traffic delay 0-15 minutes
        polyline: this.generateMockPolyline(from, to),
        instructions: this.generateMockInstructions(from, to, distance)
      };

      segments.push(segment);
      totalDistance += distance;
      totalDuration += duration;
    }

    const totalTrafficDelay = segments.reduce((sum, seg) => sum + (seg.trafficDelay || 0), 0);
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + totalDuration + totalTrafficDelay);

    return {
      id: Date.now().toString(),
      startLocation: request.startLocation,
      endLocation: request.endLocation,
      waypoints: request.waypoints || [],
      segments,
      totalDistance: Math.round(totalDistance),
      totalDuration: Math.round(totalDuration),
      totalTrafficDelay: Math.round(totalTrafficDelay),
      estimatedArrival,
      createdAt: new Date(),
      updatedAt: new Date(),
      isOptimized: false
    };
  }

  private generateAlternativeRoutes(request: RoutePlanningRequest, primaryRoute: PlannedRoute): AlternativeRoute[] {
    const alternatives: AlternativeRoute[] = [];

    // Generate fastest route alternative
    const fastestRoute: PlannedRoute = {
      ...primaryRoute,
      id: primaryRoute.id + '_fastest',
      totalDuration: Math.round(primaryRoute.totalDuration * 0.85),
      totalDistance: Math.round(primaryRoute.totalDistance * 1.1)
    };

    alternatives.push({
      route: fastestRoute,
      reason: 'fastest',
      savings: {
        time: primaryRoute.totalDuration - fastestRoute.totalDuration
      }
    });

    // Generate shortest route alternative
    const shortestRoute: PlannedRoute = {
      ...primaryRoute,
      id: primaryRoute.id + '_shortest',
      totalDuration: Math.round(primaryRoute.totalDuration * 1.15),
      totalDistance: Math.round(primaryRoute.totalDistance * 0.9)
    };

    alternatives.push({
      route: shortestRoute,
      reason: 'shortest',
      savings: {
        distance: primaryRoute.totalDistance - shortestRoute.totalDistance
      }
    });

    return alternatives;
  }

  private generateMockTrafficInfo(route: PlannedRoute): TrafficInfo[] {
    const trafficInfo: TrafficInfo[] = [];
    const severities: ('low' | 'moderate' | 'high' | 'severe')[] = ['low', 'moderate', 'high', 'severe'];

    // Generate random traffic incidents
    for (let i = 0; i < Math.random() * 3; i++) {
      const randomSegment = route.segments[Math.floor(Math.random() * route.segments.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      trafficInfo.push({
        severity,
        description: this.getTrafficDescription(severity),
        delay: severity === 'severe' ? 30 : severity === 'high' ? 20 : severity === 'moderate' ? 10 : 5,
        location: randomSegment.from,
        affectedSegments: [randomSegment.from.id || '']
      });
    }

    return trafficInfo;
  }

  private calculateDistance(from: Location, to: Location): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(to.latitude - from.latitude);
    const dLon = this.toRadians(to.longitude - from.longitude);
    const lat1 = this.toRadians(from.latitude);
    const lat2 = this.toRadians(to.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private calculateDuration(distance: number, vehicleType: string): number {
    // Average speeds by vehicle type (km/h)
    const speeds = {
      car: 60,
      bus: 45,
      truck: 40,
      motorcycle: 50
    };

    const speed = speeds[vehicleType as keyof typeof speeds] || 50;
    return (distance / speed) * 60; // Convert to minutes
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private generateMockPolyline(from: Location, to: Location): string {
    // Generate a simple encoded polyline (in real implementation, this comes from mapping API)
    return `polyline_${from.id}_to_${to.id}`;
  }

  private generateMockInstructions(from: Location, to: Location, distance: number): RouteInstruction[] {
    return [
      {
        text: `Head towards ${to.name}`,
        distance: distance * 0.1,
        duration: 5,
        maneuver: 'straight',
        location: { latitude: from.latitude, longitude: from.longitude }
      },
      {
        text: `Continue on main road for ${Math.round(distance * 0.8)} km`,
        distance: distance * 0.8,
        duration: Math.round(distance * 0.8 / 60 * 60),
        maneuver: 'straight',
        location: { 
          latitude: (from.latitude + to.latitude) / 2, 
          longitude: (from.longitude + to.longitude) / 2 
        }
      },
      {
        text: `Arrive at ${to.name}`,
        distance: distance * 0.1,
        duration: 2,
        maneuver: 'arrive',
        location: { latitude: to.latitude, longitude: to.longitude }
      }
    ];
  }

  private findNearestCity(latitude: number, longitude: number): Location | null {
    let nearest: Location | null = null;
    let minDistance = Infinity;

    for (const city of this.mockCities) {
      const distance = this.calculateDistance(
        { latitude, longitude } as Location,
        city
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    }

    return minDistance < 50 ? nearest : null; // Within 50km
  }

  private recalculateRoute(route: PlannedRoute): void {
    // Recalculate segments and totals after waypoint changes
    const allPoints = [route.startLocation, ...route.waypoints, route.endLocation];
    const segments: RouteSegment[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < allPoints.length - 1; i++) {
      const from = allPoints[i];
      const to = allPoints[i + 1];
      const distance = this.calculateDistance(from, to);
      const duration = this.calculateDuration(distance, 'car'); // Default to car

      const segment: RouteSegment = {
        from,
        to,
        distance,
        duration,
        trafficDelay: Math.random() * 10,
        polyline: this.generateMockPolyline(from, to),
        instructions: this.generateMockInstructions(from, to, distance)
      };

      segments.push(segment);
      totalDistance += distance;
      totalDuration += duration;
    }

    route.segments = segments;
    route.totalDistance = Math.round(totalDistance);
    route.totalDuration = Math.round(totalDuration);
    route.totalTrafficDelay = Math.round(segments.reduce((sum, seg) => sum + (seg.trafficDelay || 0), 0));
    
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + route.totalDuration + route.totalTrafficDelay);
    route.estimatedArrival = estimatedArrival;
  }

  private startTrafficUpdates(): void {
    // Simulate real-time traffic updates every 30 seconds
    interval(30000).subscribe(() => {
      const mockTraffic: TrafficInfo[] = [];
      
      // Generate random traffic updates
      for (let i = 0; i < Math.random() * 5; i++) {
        const randomCity = this.mockCities[Math.floor(Math.random() * this.mockCities.length)];
        const severities: ('low' | 'moderate' | 'high' | 'severe')[] = ['low', 'moderate', 'high', 'severe'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        mockTraffic.push({
          severity,
          description: this.getTrafficDescription(severity),
          delay: severity === 'severe' ? 25 : severity === 'high' ? 15 : severity === 'moderate' ? 8 : 3,
          location: randomCity,
          affectedSegments: [randomCity.id || '']
        });
      }
      
      this.trafficUpdatesSubject.next(mockTraffic);
    });
  }

  private getTrafficDescription(severity: string): string {
    const descriptions = {
      low: 'Light traffic, minor delays expected',
      moderate: 'Moderate traffic congestion',
      high: 'Heavy traffic, significant delays',
      severe: 'Severe congestion, major delays expected'
    };
    return descriptions[severity as keyof typeof descriptions] || 'Traffic information unavailable';
  }

  private isTrafficRelevantToRoute(traffic: TrafficInfo, route: PlannedRoute): boolean {
    // Check if traffic affects any segment of the route
    return route.segments.some(segment => 
      this.calculateDistance(traffic.location, segment.from) < 10 || // Within 10km
      this.calculateDistance(traffic.location, segment.to) < 10
    );
  }
}