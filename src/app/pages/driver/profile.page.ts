import {Component} from '@angular/core';
import {IonicModule,AlertController} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';
import {DriverService} from '../../core/services/driver.service';
import {Driver} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/driver/home"/></ion-buttons><ion-title>Driver Profile</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card"><ion-card-content><h2>{{driver?.name}}</h2><p>{{driver?.phone}}</p><p>{{driver?.tricycle}}</p><p>Plate {{driver?.plate}}</p><p>★ {{driver?.rating}} · {{driver?.completedTrips}} completed trips</p><ion-badge [color]="driver?.verified?'success':'warning'">{{driver?.verified?'VERIFIED':'PENDING VERIFICATION'}}</ion-badge></ion-card-content></ion-card><ion-button expand="block" color="danger" (click)="logout()">LOG OUT</ion-button></div></ion-content>`,
})
export class DriverProfilePage {
  driver?: Driver;

  constructor(public auth: AuthService, private ds: DriverService, private alert: AlertController) {
    const user = this.auth.user();
    this.driver = user ? this.ds.find(user.id) : undefined;
  }

  // Same fix as the commuter profile page: logout previously fired
  // immediately on tap with no way to back out of it.
  async logout(): Promise<void> {
    const a = await this.alert.create({
      header: 'Log Out?',
      message: 'You will need to sign in again to continue.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Log Out', role: 'destructive', handler: () => this.auth.logout() },
      ],
    });
    await a.present();
  }
}