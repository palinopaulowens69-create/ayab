import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BookingService} from '../../core/services/booking.service';
import {DriverService} from '../../core/services/driver.service';
import {USERS} from '../../../assets/mock/users';

type StatRow = [string, string | number];

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Reports</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><div class="grid2"><ion-card class="card" *ngFor="let x of data; trackBy: trackByLabel"><ion-card-content><span class="muted">{{x[0]}}</span><div class="stat">{{x[1]}}</div></ion-card-content></ion-card></div><ion-card class="card"><ion-card-header><ion-card-title>Ride Summary</ion-card-title></ion-card-header><ion-card-content><div style="height:220px;display:flex;align-items:flex-end;gap:12px"><div *ngFor="let n of weeklyRides; trackBy: trackByIndex" [style.height.%]="n" style="flex:1;background:#7a0019;border-radius:8px 8px 0 0"></div></div><p class="muted">Mock weekly completed rides chart</p></ion-card-content></ion-card></div></ion-content>`,
})
export class AdminReportsPage {
  data: StatRow[] = [];
  weeklyRides = [45, 70, 55, 90, 60, 80, 65];

  constructor(bs: BookingService, ds: DriverService) {
    const b = bs.bookings();
    const drivers = ds.drivers();
    this.data = [
      ['Total Users', USERS.length], // was hardcoded to 4
      ['Total Rides', b.length],
      ['Completed Rides', b.filter(x => x.status === 'completed').length],
      ['Cancelled Rides', b.filter(x => x.status === 'cancelled').length],
      ['Active Drivers', ds.available().length],
      // was hardcoded to 4.7
      [
        'Average Rating',
        drivers.length ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1) : 'N/A',
      ],
      ['Total Fares', '₱' + b.reduce((s, x) => s + x.fare, 0)],
    ];
  }

  trackByLabel(_: number, row: StatRow) { return row[0]; }
  trackByIndex(i: number) { return i; }
}