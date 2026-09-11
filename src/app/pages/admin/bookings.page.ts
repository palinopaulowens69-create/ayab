import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BookingService} from '../../core/services/booking.service';
import {Booking} from '../../core/models/models';

type BookingFilter = 'all' | 'active' | 'completed' | 'cancelled';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Bookings</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-segment [(ngModel)]="filter"><ion-segment-button value="all">All</ion-segment-button><ion-segment-button value="active">Active</ion-segment-button><ion-segment-button value="completed">Completed</ion-segment-button><ion-segment-button value="cancelled">Cancelled</ion-segment-button></ion-segment><ion-card class="card" *ngFor="let b of list(); trackBy: trackByBookingId"><ion-card-content><b>{{b.id}}</b><p>{{b.passengerName}} · {{b.pickup.name}} → {{b.destination.name}}</p><p>₱{{b.fare}} · {{b.distance}} km · {{b.status}}</p><small>{{b.createdAt|date:'medium'}}</small></ion-card-content></ion-card><div *ngIf="!list().length" class="empty">No bookings yet.</div></div></ion-content>`,
})
export class AdminBookingsPage {
  filter: BookingFilter = 'all';

  constructor(public bs: BookingService) {}

  list(): Booking[] {
    return this.bs.bookings().filter(b =>
      this.filter === 'all'
        ? true
        : this.filter === 'active'
          ? ['searching', 'accepted', 'verified', 'started'].includes(b.status)
          : b.status === this.filter,
    );
  }

  trackByBookingId(_: number, b: Booking) { return b.id; }
}