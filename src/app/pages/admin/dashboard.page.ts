import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {addIcons} from 'ionicons';
import {personCircleOutline} from 'ionicons/icons';
import {DriverService} from '../../core/services/driver.service';
import {BookingService} from '../../core/services/booking.service';
import {USERS} from '../../../assets/mock/users';

addIcons({ 'person-circle-outline': personCircleOutline });

type StatRow = [string, string | number];

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  template: `<ion-header><ion-toolbar color="primary"><ion-title>Admin Dashboard</ion-title><ion-buttons slot="end"><ion-button routerLink="/admin/profile"><ion-icon slot="icon-only" name="person-circle-outline" style="font-size:28px"></ion-icon></ion-button></ion-buttons></ion-toolbar></ion-header><ion-content><div class="page"><div class="hero"><h1>AYAB Admin</h1><p>Operations overview</p></div><div class="grid2"><ion-card class="card" *ngFor="let s of stats; trackBy: trackByLabel"><ion-card-content><span class="muted">{{s[0]}}</span><div class="stat">{{s[1]}}</div></ion-card-content></ion-card></div><ion-button expand="block" routerLink="/admin/drivers">DRIVER VERIFICATION</ion-button><ion-button expand="block" routerLink="/admin/bookings">BOOKINGS</ion-button><ion-button expand="block" routerLink="/admin/commuters">COMMUTERS</ion-button><ion-button expand="block" routerLink="/admin/incidents">INCIDENTS</ion-button><ion-button expand="block" routerLink="/admin/announcements">ANNOUNCEMENTS</ion-button><ion-button expand="block" routerLink="/admin/reports">REPORTS</ion-button></div></ion-content>`,
})
export class AdminDashboardPage {
  stats: StatRow[] = [];

  constructor(ds: DriverService, bs: BookingService) {
    const drivers = ds.drivers();
    const bookings = bs.bookings();
    this.stats = [
      ['Total Users', USERS.length],
      ['Total Commuters', USERS.filter(u => u.role === 'commuter').length],
      ['Total Drivers', drivers.length],
      ['Pending Drivers', drivers.filter(d => !d.verified).length],
      ['Active Trips', bookings.filter(b => ['accepted', 'verified', 'started'].includes(b.status)).length],
      ['Completed Trips', bookings.filter(b => b.status === 'completed').length],
      ['Cancelled Trips', bookings.filter(b => b.status === 'cancelled').length],
      [
        'Average Rating',
        drivers.length ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1) : 'N/A',
      ],
    ];
  }

  trackByLabel(_: number, row: StatRow) { return row[0]; }
}