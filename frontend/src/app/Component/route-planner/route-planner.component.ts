import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  Location,
  Waypoint,
  PlannedRoute,
  AlternativeRoute,
  RoutePlanningRequest,
  RoutePlanningResponse,
  GeocodeResult,
  TrafficInfo
} from '../../model/route-planning.model';
import { RoutePlanningService } from '../../service/route-planning.service';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.css']
})
export class RoutePlannerComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  routePlanningForm: FormGroup;
  currentRoute: PlannedRoute | null = null;
  alternativeRoutes: AlternativeRoute[] = [];
  trafficInfo: TrafficInfo[] = [];
  
  // Search results
  startLocationResults: GeocodeResult[] = [];
  endLocationResults: GeocodeResult[] = [];
  waypointResults: GeocodeResult[] = [];
  
  // UI state
  isPlanning = false;
  isOptimizing = false;
  showAlternatives = false;
  showTrafficDetails = false;
  showSavedRoutes = false;
  
  // Saved routes
  savedRoutes: PlannedRoute[] = [];
  
  // Vehicle types
  vehicleTypes = [
    { value: 'car', label: 'Car', icon: 'fa-car' },
    { value: 'bus', label: 'Bus', icon: 'fa-bus' },
    { value: 'truck', label: 'Truck', icon: 'fa-truck' },
    { value: 'motorcycle', label: 'Motorcycle', icon: 'fa-motorcycle' }
  ];

  constructor(
    private fb: FormBuilder,
    private routePlanningService: RoutePlanningService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.routePlanningForm = this.createForm();
  }

  ngOnInit() {
    this.setupFormSubscriptions();
    this.loadSavedRoutes();
    this.subscribeToCurrentRoute();
    this.subscribeToTrafficUpdates();
  }

  ngAfterViewInit() {
    // Component is ready
  }

  private createForm(): FormGroup {
    return this.fb.group({
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      waypoints: this.fb.array([]),
      departureTime: [''],
      preferences: this.fb.group({
        avoidTolls: [false],
        avoidHighways: [false],
        avoidFerries: [false],
        preferFastestRoute: [true],
        preferShortestRoute: [false],
        vehicleType: ['car', Validators.required]
      }),
      optimizeWaypoints: [false]
    });
  }

  get waypoints(): FormArray {
    return this.routePlanningForm.get('waypoints') as FormArray;
  }

  private setupFormSubscriptions() {
    // Start location search
    this.routePlanningForm.get('startLocation')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.routePlanningService.searchLocations(query)),
        takeUntil(this.destroy$)
      )
      .subscribe(results => {
        this.startLocationResults = results;
      });

    // End location search
    this.routePlanningForm.get('endLocation')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.routePlanningService.searchLocations(query)),
        takeUntil(this.destroy$)
      )
      .subscribe(results => {
        this.endLocationResults = results;
      });
  }

  private subscribeToCurrentRoute() {
    this.routePlanningService.currentRoute$
      .pipe(takeUntil(this.destroy$))
      .subscribe(route => {
        this.currentRoute = route;
      });
  }

  private subscribeToTrafficUpdates() {
    this.routePlanningService.trafficUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(trafficInfo => {
        this.trafficInfo = trafficInfo;
      });
  }

  selectStartLocation(result: GeocodeResult) {
    this.routePlanningForm.patchValue({
      startLocation: result.address
    });
    this.startLocationResults = [];
  }

  selectEndLocation(result: GeocodeResult) {
    this.routePlanningForm.patchValue({
      endLocation: result.address
    });
    this.endLocationResults = [];
  }

  addWaypoint() {
    const waypointGroup = this.fb.group({
      location: ['', Validators.required],
      stopDuration: [15, [Validators.min(0), Validators.max(480)]] // Max 8 hours
    });

    this.waypoints.push(waypointGroup);
  }

  removeWaypoint(index: number) {
    this.waypoints.removeAt(index);
  }

  searchWaypoint(index: number, query: string) {
    if (query.length < 2) {
      this.waypointResults = [];
      return;
    }

    this.routePlanningService.searchLocations(query)
      .subscribe(results => {
        this.waypointResults = results;
      });
  }

  selectWaypoint(index: number, result: GeocodeResult) {
    const waypointControl = this.waypoints.at(index);
    waypointControl.patchValue({
      location: result.address
    });
    this.waypointResults = [];
  }

  planRoute() {
    if (this.routePlanningForm.invalid) {
      this.markFormGroupTouched(this.routePlanningForm);
      return;
    }

    this.isPlanning = true;
    const formValue = this.routePlanningForm.value;

    // Convert form data to request format
    const request: RoutePlanningRequest = {
      startLocation: this.findLocationByAddress(formValue.startLocation),
      endLocation: this.findLocationByAddress(formValue.endLocation),
      waypoints: this.convertWaypointsFromForm(formValue.waypoints),
      preferences: formValue.preferences,
      departureTime: formValue.departureTime ? new Date(formValue.departureTime) : undefined,
      optimizeWaypoints: formValue.optimizeWaypoints
    };

    this.routePlanningService.planRoute(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: RoutePlanningResponse) => {
          this.currentRoute = response.primaryRoute;
          this.alternativeRoutes = response.alternativeRoutes;
          this.trafficInfo = response.trafficInfo;
          this.isPlanning = false;
          
          if (response.warnings.length > 0) {
            this.showWarnings(response.warnings);
          }
        },
        error: (error) => {
          console.error('Error planning route:', error);
          this.isPlanning = false;
          this.showError('Failed to plan route. Please try again.');
        }
      });
  }

  optimizeRoute() {
    if (!this.currentRoute) return;

    this.isOptimizing = true;
    this.routePlanningService.optimizeWaypoints(this.currentRoute)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (optimizedRoute) => {
          this.currentRoute = optimizedRoute;
          this.isOptimizing = false;
          this.showSuccess('Route optimized successfully!');
        },
        error: (error) => {
          console.error('Error optimizing route:', error);
          this.isOptimizing = false;
          this.showError('Failed to optimize route.');
        }
      });
  }

  selectAlternativeRoute(alternative: AlternativeRoute) {
    this.currentRoute = alternative.route;
    this.showAlternatives = false;
  }

  saveRoute() {
    if (!this.currentRoute) return;

    const routeName = prompt('Enter a name for this route:');
    if (!routeName) return;

    this.routePlanningService.saveRoute(this.currentRoute, routeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('Route saved successfully!');
          this.loadSavedRoutes();
        },
        error: (error) => {
          console.error('Error saving route:', error);
          this.showError('Failed to save route.');
        }
      });
  }

  loadSavedRoute(route: PlannedRoute) {
    this.currentRoute = route;
    this.showSavedRoutes = false;
    
    // Update form with loaded route data
    this.routePlanningForm.patchValue({
      startLocation: route.startLocation.address,
      endLocation: route.endLocation.address
    });

    // Clear and rebuild waypoints
    this.waypoints.clear();
    route.waypoints.forEach(waypoint => {
      const waypointGroup = this.fb.group({
        location: [waypoint.address],
        stopDuration: [waypoint.stopDuration || 15]
      });
      this.waypoints.push(waypointGroup);
    });
  }

  clearRoute() {
    this.currentRoute = null;
    this.alternativeRoutes = [];
    this.routePlanningForm.reset();
    this.waypoints.clear();
    
    // Reset preferences to defaults
    this.routePlanningForm.patchValue({
      preferences: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
        preferFastestRoute: true,
        preferShortestRoute: false,
        vehicleType: 'car'
      },
      optimizeWaypoints: false
    });
  }

  getRouteStatusClass(): string {
    if (!this.currentRoute) return '';
    
    const hasHighTraffic = this.trafficInfo.some(t => t.severity === 'high' || t.severity === 'severe');
    return hasHighTraffic ? 'route-warning' : 'route-normal';
  }

  getTrafficSeverityIcon(severity: string): string {
    const icons = {
      low: 'fa-check-circle text-green-500',
      moderate: 'fa-exclamation-circle text-yellow-500',
      high: 'fa-exclamation-triangle text-orange-500',
      severe: 'fa-times-circle text-red-500'
    };
    return icons[severity as keyof typeof icons] || 'fa-info-circle';
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  formatDistance(kilometers: number): string {
    if (kilometers >= 1000) {
      return `${(kilometers / 1000).toFixed(1)}k km`;
    }
    return `${kilometers} km`;
  }

  private loadSavedRoutes() {
    this.routePlanningService.getSavedRoutes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(routes => {
        this.savedRoutes = routes;
      });
  }

  private findLocationByAddress(address: string): Location {
    // In a real implementation, this would search through cached results
    // For now, return a mock location
    return {
      id: Date.now().toString(),
      name: address.split(',')[0],
      address: address,
      latitude: 20.5937,
      longitude: 78.9629
    };
  }

  private convertWaypointsFromForm(waypointsForm: any[]): Waypoint[] {
    return waypointsForm.map((wp, index) => ({
      id: `waypoint_${index}`,
      name: wp.location.split(',')[0],
      address: wp.location,
      latitude: 20.5937 + Math.random() * 10,
      longitude: 78.9629 + Math.random() * 10,
      type: 'waypoint' as const,
      order: index + 1,
      stopDuration: wp.stopDuration
    }));
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onLocationSelected(location: Location) {
    // Handle location selection from map
    if (!this.routePlanningForm.get('startLocation')?.value) {
      this.routePlanningForm.patchValue({
        startLocation: location.address
      });
    } else if (!this.routePlanningForm.get('endLocation')?.value) {
      this.routePlanningForm.patchValue({
        endLocation: location.address
      });
    } else {
      // Add as waypoint
      this.addWaypoint();
      const lastIndex = this.waypoints.length - 1;
      const waypointControl = this.waypoints.at(lastIndex);
      waypointControl.patchValue({
        location: location.address
      });
    }
  }

  private showSuccess(message: string) {
    // In a real app, use a toast/notification service
    alert(message);
  }

  private showError(message: string) {
    // In a real app, use a toast/notification service
    alert(message);
  }

  private showWarnings(warnings: string[]) {
    // In a real app, use a toast/notification service
    alert('Warnings:\n' + warnings.join('\n'));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}