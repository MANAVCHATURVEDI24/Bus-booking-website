import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location, PlannedRoute, Waypoint, TrafficInfo } from '../../model/route-planning.model';
import { RoutePlanningService } from '../../service/route-planning.service';

declare var google: any;

@Component({
  selector: 'app-interactive-map',
  templateUrl: './interactive-map.component.html',
  styleUrls: ['./interactive-map.component.css']
})
export class InteractiveMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() route: PlannedRoute | null = null;
  @Input() height: string = '400px';
  @Input() enableInteraction: boolean = true;
  @Output() locationSelected = new EventEmitter<Location>();
  @Output() waypointAdded = new EventEmitter<Waypoint>();

  private destroy$ = new Subject<void>();
  private map: any;
  private directionsService: any;
  private directionsRenderer: any;
  private markers: any[] = [];
  private trafficLayer: any;
  private infoWindow: any;

  // Map configuration
  mapOptions = {
    zoom: 6,
    center: { lat: 20.5937, lng: 78.9629 }, // Center of India
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  trafficInfo: TrafficInfo[] = [];
  isMapLoaded = false;

  constructor(private routePlanningService: RoutePlanningService) {}

  ngOnInit() {
    this.initializeMap();
    this.subscribeToTrafficUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMap() {
    // For demo purposes, we'll create a mock map interface
    // In production, you would integrate with Google Maps, Mapbox, or OpenStreetMap
    
    setTimeout(() => {
      this.createMockMap();
      this.isMapLoaded = true;
      
      if (this.route) {
        this.displayRoute(this.route);
      }
    }, 1000);

    // Real Google Maps implementation would be:
    /*
    if (typeof google !== 'undefined') {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, this.mapOptions);
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        suppressMarkers: false
      });
      this.directionsRenderer.setMap(this.map);
      this.trafficLayer = new google.maps.TrafficLayer();
      this.infoWindow = new google.maps.InfoWindow();

      // Add click listener for adding waypoints
      if (this.enableInteraction) {
        this.map.addListener('click', (event: any) => {
          this.onMapClick(event.latLng);
        });
      }

      this.isMapLoaded = true;
      
      if (this.route) {
        this.displayRoute(this.route);
      }
    }
    */
  }

  private createMockMap() {
    // Create a visual representation of the map for demo
    const mapElement = this.mapContainer.nativeElement;
    mapElement.innerHTML = `
      <div class="mock-map">
        <div class="map-controls">
          <button class="map-btn" (click)="toggleTraffic()">
            <i class="fa-solid fa-road"></i> Traffic
          </button>
          <button class="map-btn" (click)="centerMap()">
            <i class="fa-solid fa-crosshairs"></i> Center
          </button>
          <button class="map-btn" (click)="toggleSatellite()">
            <i class="fa-solid fa-satellite"></i> Satellite
          </button>
        </div>
        <div class="route-display" id="routeDisplay">
          <div class="map-placeholder">
            <div class="map-visual">
              <div class="india-map">
                <!-- Map Background with India outline -->
                <div class="india-outline"></div>
                
                <!-- Major Cities -->
                <div class="city-marker delhi" title="New Delhi" data-city="Delhi">
                  <div class="marker-dot start-marker"></div>
                  <span class="city-name">Delhi</span>
                </div>
                <div class="city-marker mumbai" title="Mumbai" data-city="Mumbai">
                  <div class="marker-dot"></div>
                  <span class="city-name">Mumbai</span>
                </div>
                <div class="city-marker bangalore" title="Bangalore" data-city="Bangalore">
                  <div class="marker-dot"></div>
                  <span class="city-name">Bangalore</span>
                </div>
                <div class="city-marker chennai" title="Chennai" data-city="Chennai">
                  <div class="marker-dot"></div>
                  <span class="city-name">Chennai</span>
                </div>
                <div class="city-marker kolkata" title="Kolkata" data-city="Kolkata">
                  <div class="marker-dot"></div>
                  <span class="city-name">Kolkata</span>
                </div>
                <div class="city-marker jaipur" title="Jaipur" data-city="Jaipur">
                  <div class="marker-dot end-marker"></div>
                  <span class="city-name">Jaipur</span>
                </div>
                
                <!-- Sample Route Lines -->
                <div class="route-line delhi-jaipur active-route"></div>
                <div class="route-line mumbai-bangalore"></div>
                
                <!-- Traffic Indicators -->
                <div class="traffic-indicator heavy-traffic" style="top: 40%; left: 50%;">
                  <i class="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div class="traffic-indicator moderate-traffic" style="top: 60%; left: 40%;">
                  <i class="fa-solid fa-clock"></i>
                </div>
              </div>
            </div>
            <div class="map-instructions">
              <p><i class="fa-solid fa-info-circle"></i> Click on cities to add them to your route</p>
              <p><i class="fa-solid fa-route"></i> Plan a route to see detailed visualization</p>
              <p><i class="fa-solid fa-map"></i> Interactive map with real-time traffic updates</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add click listener for mock map
    if (this.enableInteraction) {
      const cityMarkers = mapElement.querySelectorAll('.city-marker');
      cityMarkers.forEach((marker: Element) => {
        marker.addEventListener('click', (event: Event) => {
          const cityName = (event.currentTarget as HTMLElement).getAttribute('data-city');
          if (cityName) {
            this.onCityClick(cityName);
          }
        });
      });
    }
  }

  private onCityClick(cityName: string) {
    // Mock city data
    const cityData: { [key: string]: Location } = {
      'Delhi': { id: '2', name: 'Delhi', address: 'New Delhi, Delhi, India', latitude: 28.6139, longitude: 77.2090 },
      'Mumbai': { id: '1', name: 'Mumbai', address: 'Mumbai, Maharashtra, India', latitude: 19.0760, longitude: 72.8777 },
      'Bangalore': { id: '3', name: 'Bangalore', address: 'Bangalore, Karnataka, India', latitude: 12.9716, longitude: 77.5946 },
      'Chennai': { id: '4', name: 'Chennai', address: 'Chennai, Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707 },
      'Kolkata': { id: '5', name: 'Kolkata', address: 'Kolkata, West Bengal, India', latitude: 22.5726, longitude: 88.3639 },
      'Jaipur': { id: '9', name: 'Jaipur', address: 'Jaipur, Rajasthan, India', latitude: 26.9124, longitude: 75.7873 }
    };

    const location = cityData[cityName];
    if (location) {
      this.locationSelected.emit(location);
    }
  }

  displayRoute(route: PlannedRoute) {
    if (!this.isMapLoaded) {
      return;
    }

    this.clearMarkers();
    
    // For mock implementation, update the display
    const routeDisplay = this.mapContainer.nativeElement.querySelector('#routeDisplay');
    if (routeDisplay) {
      routeDisplay.innerHTML = `
        <div class="route-visualization" style="background: rgba(31, 41, 55, 0.98) !important; color: #f9fafb !important;">
          <div class="route-header">
            <h3 class="text-lg font-semibold mb-2" style="color: #f9fafb !important;">
              <i class="fa-solid fa-route text-blue-500 mr-2"></i>
              ${route.startLocation.name} → ${route.endLocation.name}
            </h3>
            <div class="route-stats">
              <span class="stat-item" style="color: #f9fafb !important;">
                <i class="fa-solid fa-road text-green-500"></i>
                ${route.totalDistance} km
              </span>
              <span class="stat-item" style="color: #f9fafb !important;">
                <i class="fa-solid fa-clock text-blue-500"></i>
                ${Math.floor(route.totalDuration / 60)}h ${route.totalDuration % 60}m
              </span>
              ${route.totalTrafficDelay > 0 ? `
                <span class="stat-item" style="color: #f9fafb !important;">
                  <i class="fa-solid fa-exclamation-triangle text-orange-500"></i>
                  +${Math.floor(route.totalTrafficDelay / 60)}h ${route.totalTrafficDelay % 60}m delay
                </span>
              ` : ''}
            </div>
          </div>
          
          <div class="route-path">
            ${this.generateRouteVisualization(route)}
          </div>
          
          ${route.waypoints.length > 0 ? `
            <div class="waypoints-list">
              <h4 class="font-medium mb-2" style="color: #f9fafb !important;">
                <i class="fa-solid fa-map-pin text-blue-500 mr-2"></i>
                Waypoints (${route.waypoints.length}):
              </h4>
              ${route.waypoints.map((wp, index) => `
                <div class="waypoint-item">
                  <span class="waypoint-number">${index + 1}</span>
                  <i class="fa-solid fa-map-pin text-blue-500"></i>
                  <span class="waypoint-name" style="color: #f9fafb !important;">${wp.name}</span>
                  ${wp.stopDuration ? `<span class="stop-duration" style="color: #d1d5db !important;">(${wp.stopDuration}min stop)</span>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${this.trafficInfo.length > 0 ? `
            <div class="traffic-alerts">
              <h4 class="font-medium mb-2" style="color: #f9fafb !important;">
                <i class="fa-solid fa-exclamation-triangle text-orange-500 mr-2"></i>
                Traffic Alerts (${this.trafficInfo.length}):
              </h4>
              ${this.trafficInfo.map(traffic => `
                <div class="traffic-alert ${traffic.severity}">
                  <i class="fa-solid fa-${this.getTrafficIcon(traffic.severity)}"></i>
                  <div class="traffic-content">
                    <div class="traffic-location" style="color: inherit !important;">${traffic.location.name}</div>
                    <div class="traffic-description" style="color: inherit !important;">${traffic.description}</div>
                    <div class="traffic-delay" style="color: inherit !important;">Expected delay: ${traffic.delay} minutes</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="route-summary-footer">
            <div class="estimated-arrival" style="color: #f9fafb !important;">
              <i class="fa-solid fa-flag-checkered text-green-500 mr-2"></i>
              <strong>Estimated Arrival:</strong> ${route.estimatedArrival.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            ${route.isOptimized ? `
              <div class="optimization-badge">
                <i class="fa-solid fa-magic text-purple-500 mr-1"></i>
                Route Optimized
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Real Google Maps implementation would be:
    /*
    const waypoints = route.waypoints.map(wp => ({
      location: new google.maps.LatLng(wp.latitude, wp.longitude),
      stopover: true
    }));

    const request = {
      origin: new google.maps.LatLng(route.startLocation.latitude, route.startLocation.longitude),
      destination: new google.maps.LatLng(route.endLocation.latitude, route.endLocation.longitude),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: route.isOptimized
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.addRouteMarkers(route);
      }
    });
    */
  }

  private generateRouteVisualization(route: PlannedRoute): string {
    const segments = route.segments;
    let visualization = '';
    
    segments.forEach((segment, index) => {
      const hasTraffic = this.trafficInfo.some(t => 
        t.location.id === segment.from.id || t.location.id === segment.to.id
      );
      
      visualization += `
        <div class="route-segment ${hasTraffic ? 'has-traffic' : ''}">
          <div class="segment-header">
            <span class="segment-number">${index + 1}</span>
            <div class="segment-info">
              <div class="segment-route">
                <span class="from" style="color: #f9fafb !important;">${segment.from.name}</span>
                <i class="fa-solid fa-arrow-right mx-2 text-blue-500"></i>
                <span class="to" style="color: #f9fafb !important;">${segment.to.name}</span>
              </div>
              <div class="segment-stats">
                <span class="distance" style="color: #d1d5db !important;">
                  <i class="fa-solid fa-road text-gray-500"></i>
                  ${Math.round(segment.distance)} km
                </span>
                <span class="duration" style="color: #d1d5db !important;">
                  <i class="fa-solid fa-clock text-gray-500"></i>
                  ${Math.round(segment.duration)} min
                </span>
                ${segment.trafficDelay ? `
                  <span class="traffic-delay" style="color: #ef4444 !important;">
                    <i class="fa-solid fa-exclamation-triangle text-orange-500"></i>
                    +${Math.round(segment.trafficDelay)} min
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    return visualization;
  }

  private getTrafficIcon(severity: string): string {
    const icons = {
      low: 'check-circle',
      moderate: 'exclamation-circle',
      high: 'exclamation-triangle',
      severe: 'times-circle'
    };
    return icons[severity as keyof typeof icons] || 'info-circle';
  }

  addWaypoint(location: Location) {
    if (!this.route) return;

    const waypoint: Waypoint = {
      ...location,
      type: 'waypoint',
      order: this.route.waypoints.length + 1,
      stopDuration: 15 // Default 15 minutes stop
    };

    this.waypointAdded.emit(waypoint);
  }

  removeWaypoint(waypointId: string) {
    if (!this.route) return;
    
    this.routePlanningService.removeWaypoint(this.route, waypointId).subscribe(updatedRoute => {
      this.route = updatedRoute;
      this.displayRoute(updatedRoute);
    });
  }

  toggleTraffic() {
    // Toggle traffic layer visibility
    if (this.trafficLayer) {
      if (this.trafficLayer.getMap()) {
        this.trafficLayer.setMap(null);
      } else {
        this.trafficLayer.setMap(this.map);
      }
    }
  }

  centerMap() {
    if (this.route && this.map) {
      // Center map on route
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(this.route.startLocation.latitude, this.route.startLocation.longitude));
      bounds.extend(new google.maps.LatLng(this.route.endLocation.latitude, this.route.endLocation.longitude));
      
      this.route.waypoints.forEach(wp => {
        bounds.extend(new google.maps.LatLng(wp.latitude, wp.longitude));
      });
      
      this.map.fitBounds(bounds);
    }
  }

  toggleSatellite() {
    if (this.map) {
      const currentType = this.map.getMapTypeId();
      this.map.setMapTypeId(currentType === 'satellite' ? 'roadmap' : 'satellite');
    }
  }

  private subscribeToTrafficUpdates() {
    this.routePlanningService.trafficUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(trafficInfo => {
        this.trafficInfo = trafficInfo;
        if (this.route) {
          this.displayRoute(this.route);
        }
      });
  }

  private clearMarkers() {
    this.markers.forEach((marker: any) => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
    this.markers = [];
  }

  private addRouteMarkers(route: PlannedRoute) {
    // Add start marker
    this.addMarker(route.startLocation, 'start', 'green');
    
    // Add waypoint markers
    route.waypoints.forEach((waypoint, index) => {
      this.addMarker(waypoint, `waypoint-${index + 1}`, 'blue');
    });
    
    // Add end marker
    this.addMarker(route.endLocation, 'end', 'red');
  }

  private addMarker(location: Location, title: string, color: string) {
    // Mock marker implementation
    console.log(`Adding ${color} marker for ${location.name} at ${location.latitude}, ${location.longitude}`);
    
    // Real Google Maps implementation would be:
    /*
    const marker = new google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: this.map,
      title: title,
      icon: {
        url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
      }
    });

    marker.addListener('click', () => {
      this.infoWindow.setContent(`
        <div>
          <h3>${location.name}</h3>
          <p>${location.address}</p>
        </div>
      `);
      this.infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    */
  }
}
