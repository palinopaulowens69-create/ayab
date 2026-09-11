import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {DriverService} from '../../core/services/driver.service';
import {BookingService} from '../../core/services/booking.service';
import {Driver} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule, RouterLink],
  template: `<ion-header><ion-toolbar color="primary"><ion-title>Driver Dashboard</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><div class="hero"><p>Welcome, {{auth.user()?.name}}</p><h1>{{driver?.online?'ONLINE':'OFFLINE'}}</h1><ion-button color="secondary" (click)="toggle()">{{driver?.online?'GO OFFLINE':'GO ONLINE'}}</ion-button></div><div class="grid2"><ion-card class="card"><ion-card-content><span class="muted">Today's Trips</span><div class="stat">{{todayTrips()}}</div></ion-card-content></ion-card><ion-card class="card"><ion-card-content><span class="muted">Completed Trips</span><div class="stat">{{driver?.completedTrips}}</div></ion-card-content></ion-card><ion-card class="card"><ion-card-content><span class="muted">Rating</span><div class="stat">★ {{driver?.rating}}</div></ion-card-content></ion-card><ion-card class="card"><ion-card-content><span class="muted">Earnings</span><div class="stat">₱{{todayEarnings()}}</div></ion-card-content></ion-card></div><ion-button expand="block" routerLink="/driver/requests">RIDE REQUESTS</ion-button><ion-button expand="block" fill="outline" routerLink="/driver/qr">MY QR CODE</ion-button><ion-button expand="block" fill="outline" routerLink="/driver/history">TRIP HISTORY</ion-button><ion-button expand="block" fill="outline" routerLink="/driver/profile">PROFILE</ion-button></div></ion-content>`,
})
export class DriverHomePage {
  driver?: Driver;

  constructor(public auth: AuthService, private ds: DriverService, private bs: BookingService) {
    const user = this.auth.user();
    this.driver = user ? this.ds.find(user.id) : undefined;
  }

  toggle(): void {
    if (!this.driver) return;
    this.ds.toggle(this.driver.id);
    this.driver = this.ds.find(this.driver.id);
  }

  // Was hardcoded to "8" — now actually counts today's bookings for this driver.
  todayTrips(): number {
    if (!this.driver) return 0;
    const today = new Date().toDateString();
    return this.bs
      .bookings()
      .filter(b => b.driverId === this.driver!.id && new Date(b.createdAt).toDateString() === today).length;
  }

  // Was hardcoded to "₱1,240" — now sums today's completed-trip fares for this driver.
  todayEarnings(): number {
    if (!this.driver) return 0;
    const today = new Date().toDateString();
    return this.bs
      .bookings()
      .filter(
        b =>
          b.driverId === this.driver!.id &&
          b.status === 'completed' &&
          new Date(b.createdAt).toDateString() === today,
      )
      .reduce((sum, b) => sum + (b.fare ?? 0), 0);
  }
}