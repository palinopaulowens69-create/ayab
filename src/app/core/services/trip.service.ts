import {Injectable} from '@angular/core';
import {BookingService} from './booking.service';
@Injectable({providedIn:'root'}) export class TripService{constructor(private bookings:BookingService){} start(id:string){this.bookings.update(id,'started')} complete(id:string){this.bookings.update(id,'completed')}}
