import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.component.html',
  styleUrl: './bus-box.component.css'
})
export class BusBoxComponent {
@Input() rating:number[]=[];
@Input() operatorname:string=''
@Input() bustype:string=''
@Input() departuretime:string=""
@Input() reschedulable :number=0
@Input() livetracking: number=0
@Input() filledseats:any[]=[]
@Input() routedetails: any
@Input() busid:string=''
avgrating:number=0
totalreview:number=0
seatprivce:number=0
bustypename:string=''
busdeparturetime:number=0;
busarrivaltime:number=0

constructor(private dialog: MatDialog){}

ngOnInit(): void{
  this.rating.forEach((item,index)=> {
    this.avgrating+=  item;
    this.totalreview += index;
  });
  if(this.totalreview==0){
    this.totalreview=1
  }
  this.avgrating=+this.avgrating/this.totalreview
  // console.log(this.routedetails)
  if(this.bustype ==='standard'){
    this.seatprivce=50 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='standard;'
  }else if(this.bustype ==='sleeper'){
    this.seatprivce=100 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='sleeper;'
  }else if (this.bustype ==='A/C Seater'){
    this.seatprivce=125 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='A/C Seater;'
  }else{
    this.seatprivce=75 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='Non - A/C;'
  }
  const numericvalue=parseInt(this.departuretime,10);
  this.busdeparturetime=numericvalue
  this.busarrivaltime=(numericvalue + this.routedetails.duration) % 24;
}

showReviews() {
  this.dialog.open(ReviewModalComponent, {
    width: '800px',
    maxWidth: '90vw',
    data: {
      routeId: this.routedetails._id,
      busId: this.busid,
      operatorName: this.operatorname
    }
  });
}
}
