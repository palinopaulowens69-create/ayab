import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';
import {DriverService} from '../../core/services/driver.service';
import {BookingService} from '../../core/services/booking.service';
import {Booking} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/driver/home"/></ion-buttons><ion-title>Trip History</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngFor="let b of trips(); trackBy: trackByBookingId"><ion-item lines="none"><ion-label><b>{{b.passengerName}}</b><p>{{b.pickup.name}} → {{b.destination.name}}</p><p>₱{{b.fare}} · {{b.status}}</p><p *ngIf="b.rating">{{'★'.repeat(b.rating)}}</p></ion-label></ion-item></ion-card><div *ngIf="!trips().length" class="empty">No trips yet.</div></div></ion-content>`,
})
export class DriverHistoryPage {
  constructor(public auth: AuthService, private ds: DriverService, private bs: BookingService) {}

  // Was: this.ds.drivers().find(d => d.email === 'driver@ayab.com'), so every
  // driver saw the same demo account's history. Now uses the logged-in user.
  trips(): Booking[] {
    const user = this.auth.user();
    if (!user) return [];
    const driver = this.ds.find(user.id);
    if (!driver) return [];
    return this.bs.bookings().filter(b => b.driverId === driver.id);
  }

  trackByBookingId(_: number, b: Booking) { return b.id; }
}