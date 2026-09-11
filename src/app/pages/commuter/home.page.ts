import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {addIcons} from 'ionicons';
import {notificationsOutline} from 'ionicons/icons';
import {AuthService} from '../../core/services/auth.service';
import {DriverService} from '../../core/services/driver.service';
import {BookingService} from '../../core/services/booking.service';
import {AdminService} from '../../core/services/admin.service';

addIcons({ 'notifications-outline': notificationsOutline });

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  template: `<ion-header><ion-toolbar color="primary"><ion-title>AYAB</ion-title><ion-buttons slot="end"><ion-button routerLink="/commuter/notifications" aria-label="Notifications"><ion-icon slot="icon-only" name="notifications-outline" style="font-size:22px"></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header><ion-content><div class="page"><div class="hero"><p>Hello, {{auth.user()?.name}}</p><h1>Where are you going?</h1><ion-button color="secondary" routerLink="/commuter/book">BOOK A RIDE</ion-button></div><div class="section-title">Nearby drivers</div><ion-card class="card" *ngFor="let d of drivers.available(); trackBy: trackByDriverId"><ion-item lines="none"><ion-avatar slot="start"><div style="width:100%;height:100%;display:grid;place-items:center;background:#7a0019;color:#fff">{{d.name[0]}}</div></ion-avatar><ion-label><b>{{d.name}}</b><p>★ {{d.rating}} · {{d.eta}} min · {{d.plate}}</p></ion-label><ion-badge color="success">ONLINE</ion-badge></ion-item></ion-card><div class="section-title">Announcements</div><ion-card class="card" *ngFor="let a of admin.announcements(); trackBy: trackByAnnouncementId"><ion-card-header><ion-card-title>{{a.title}}</ion-card-title></ion-card-header><ion-card-content>{{a.body}}</ion-card-content></ion-card><div class="section-title">Recent trips</div><ion-card class="card" *ngFor="let b of recentBookings(); trackBy: trackByBookingId"><ion-item lines="none"><ion-label><b>{{b.pickup.name}} → {{b.destination.name}}</b><p>₱{{b.fare}} · {{b.status}}</p></ion-label></ion-item></ion-card><ion-grid><ion-row><ion-col><ion-button expand="block" fill="outline" routerLink="/commuter/history">Trip History</ion-button></ion-col><ion-col><ion-button expand="block" fill="outline" routerLink="/commuter/profile">Profile</ion-button></ion-col></ion-row></ion-grid></div></ion-content>`,
})
export class CommuterHomePage {
  constructor(
    public auth: AuthService,
    public drivers: DriverService,
    public bookings: BookingService,
    public admin: AdminService,
  ) {}

  // Slicing directly in the template created a brand-new array every change
  // detection cycle even when the underlying data hadn't changed; pulling it
  // into a method + trackBy at least stops Angular from re-rendering rows
  // unnecessarily.
  recentBookings() {
    return this.bookings.byUser().slice(0, 3);
  }

  // NOTE: assumes Driver/Announcement/Booking models expose an `id` field;
  // adjust field names below if your models differ.
  trackByDriverId(_: number, d: { id: string }) { return d.id; }
  trackByAnnouncementId(_: number, a: { id: string }) { return a.id; }
  trackByBookingId(_: number, b: { id: string }) { return b.id; }
}