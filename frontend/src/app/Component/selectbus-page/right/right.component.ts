import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../../../service/bus.service';
import { Bus } from '../../../model/bus.model';
import { Route } from '../../../model/routes.model';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrl: './right.component.css'
})
export class RightComponent implements OnInit{
 matchedbus:Bus[]=[]
 routes:Route[]=[]
 seats:{[key:string]:any}={}

 departurevar:string=''
 arrival:string=''
 date:string=''

 // Add loading and error states
 isLoading: boolean = false;
 errorMessage: string = '';

 constructor(private route:ActivatedRoute,private busservice:BusService){}

 getkeys(){
  return Object.keys(this.seats)
 }
 
 ngOnInit(): void {
   this.route.queryParams.subscribe(params=>{
    const departure=params['departure'];
    const arrival=params['arrival'];
    const date=params['date'];
    this.departurevar=departure
    this.arrival=arrival
    this.date=date
    
    console.log('Route params:', { departure, arrival, date });
    
    // Only make API call if we have all required parameters
    if (departure && arrival && date) {
      this.loadBusData();
    } else {
      this.errorMessage = 'Missing route parameters';
      console.error('Missing route parameters:', { departure, arrival, date });
    }
   });
 }

 loadBusData(): void {
   this.isLoading = true;
   this.errorMessage = '';
   
   console.log('Making API call with:', this.departurevar, this.arrival, this.date);
   
   this.busservice.GETBUSDETAILS(this.departurevar, this.arrival, this.date).subscribe({
     next: (response: any) => {
       console.log('API Response:', response);
       this.matchedbus = response.matchedBuses || [];
       this.routes = response.route || [];
       this.seats = response.busidwithseatobj || {};
       this.isLoading = false;
       
       if (this.matchedbus.length === 0) {
         this.errorMessage = 'No buses found for this route and date.';
       }
     },
     error: (error) => {
       console.error('API Error:', error);
       this.errorMessage = `Failed to load bus data: ${error.message || 'Unknown error'}`;
       this.isLoading = false;
     }
   });
 }
}
