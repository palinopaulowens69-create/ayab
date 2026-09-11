import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';
import {BookingService} from '../../core/services/booking.service';
import {DriverService} from '../../core/services/driver.service';
import {Booking} from '../../core/models/models';

type DriverTripStatus = Booking['status'];

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/driver/home"/></ion-buttons><ion-title>Active Trip</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngIf="trip"><ion-card-content><h2>{{trip.passengerName}}</h2><p>{{trip.pickup.name}} → {{trip.destination.name}}</p><p>{{trip.distance}} km · ₱{{trip.fare}}</p><div class="map"><div class="road"></div><div class="marker driver-marker" style="left:45%;top:40%"></div><div class="marker" style="left:72%;top:65%"></div></div><ion-button expand="block" (click)="status('arrived')">ARRIVED</ion-button><ion-button expand="block" (click)="status('started')">START TRIP</ion-button><ion-button expand="block" color="success" (click)="status('completed')">COMPLETE TRIP</ion-button></ion-card-content></ion-card><div *ngIf="!trip" class="empty">No active trip.</div></div></ion-content>`,
})
export class DriverTripPage implements OnInit {
  trip?: Booking;

  constructor(private auth: AuthService, private bs: BookingService, private ds: DriverService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    // Was: ds.drivers().find(d => d.email === ds.drivers()[0]?.email), which
    // is a self-referential comparison that always resolves to drivers()[0]
    // regardless of who's actually logged in. Now uses the real session user.
    const user = this.auth.user();
    const driver = user ? this.ds.find(user.id) : undefined;
    if (!driver) {
      this.trip = undefined;
      return;
    }
    // 'arrived' was missing from this list, so tapping ARRIVED made the trip
    // disappear from the driver's own screen even though it was still active.
    this.trip = this.bs
      .bookings()
      .find(b => b.driverId === driver.id && ['accepted', 'verified', 'arrived', 'started'].includes(b.status));
  }

  status(s: DriverTripStatus): void {
    if (this.trip) this.bs.update(this.trip.id, s);
    this.refresh();
  }
}