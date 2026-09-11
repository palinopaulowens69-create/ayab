import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule,ToastController} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';
import {BookingService} from '../../core/services/booking.service';
import {DriverService} from '../../core/services/driver.service';
import {Booking} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/driver/home"/></ion-buttons><ion-title>Ride Requests</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngFor="let b of pending(); trackBy: trackByBookingId"><ion-card-header><ion-card-title>NEW RIDE REQUEST</ion-card-title></ion-card-header><ion-card-content><p><b>Passenger:</b> {{b.passengerName}}</p><p><b>Pickup:</b> {{b.pickup.name}}</p><p><b>Destination:</b> {{b.destination.name}}</p><p><b>Distance:</b> {{b.distance}} km</p><p><b>Fare:</b> ₱{{b.fare}}</p><ion-grid><ion-row><ion-col><ion-button expand="block" color="success" (click)="accept(b)">ACCEPT</ion-button></ion-col><ion-col><ion-button expand="block" color="danger" fill="outline" (click)="decline(b)">DECLINE</ion-button></ion-col></ion-row></ion-grid></ion-card-content></ion-card><div *ngIf="!pending().length" class="empty">No incoming requests.<br><small>Commuter bookings will appear here when this driver is available.</small></div></div></ion-content>`,
})
export class DriverRequestsPage {
  constructor(
    public bs: BookingService,
    private ds: DriverService,
    private auth: AuthService,
    private t: ToastController,
  ) {}

  // Previously computed an unused `d` variable here (dead code) that looked
  // like it was meant to filter requests for this driver but never did.
  pending(): Booking[] {
    return this.bs.bookings().filter(b => b.status === 'searching' && !b.driverId);
  }

  trackByBookingId(_: number, b: Booking) { return b.id; }

  // Previously: looked up the booking's own (always-empty) driverId, fell
  // back to a hardcoded 'd1', then to the first available driver — never the
  // driver who actually tapped Accept. A ride could get assigned to a
  // completely different driver than the one accepting it.
  async accept(b: Booking): Promise<void> {
    const user = this.auth.user();
    const driver = user ? this.ds.find(user.id) : undefined;
    if (!driver) return;
    this.bs.update(b.id, 'accepted', driver.id);
    (await this.t.create({ message: 'Ride accepted.', duration: 1000, color: 'success' })).present();
  }

  async decline(b: Booking): Promise<void> {
    this.bs.update(b.id, 'cancelled');
    (await this.t.create({ message: 'Request declined.', duration: 1000 })).present();
  }
}