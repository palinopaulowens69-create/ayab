import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule,ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PLACES} from '../../../assets/mock/places';
import {Place} from '../../core/models/models';
import {BookingService} from '../../core/services/booking.service';
import {FareService} from '../../core/services/fare.service';
import {LocationService} from '../../core/services/location.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>Book a Ride</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><div class="map"><div class="road"></div><div class="marker" style="left:35%;top:42%"></div><div class="marker driver-marker" style="left:62%;top:30%"></div><div class="marker" style="left:70%;top:65%"></div></div><ion-card class="card"><ion-card-header><ion-card-title>Choose locations</ion-card-title></ion-card-header><ion-card-content><ion-item><ion-select label="Pickup" labelPlacement="stacked" [(ngModel)]="pickup"><ion-select-option *ngFor="let p of places; trackBy: trackByPlaceId" [value]="p">{{p.name}}</ion-select-option></ion-select></ion-item><ion-item><ion-select label="Destination" labelPlacement="stacked" [(ngModel)]="destination"><ion-select-option *ngFor="let p of places; trackBy: trackByPlaceId" [value]="p">{{p.name}}</ion-select-option></ion-select></ion-item><div *ngIf="pickup&&destination" style="padding:16px 0"><span class="muted">Distance</span><div>{{distance()}} km</div><span class="muted">Estimated Fare</span><div class="fare">₱{{fare()}}</div></div><ion-button expand="block" size="large" [disabled]="!pickup||!destination||pickup.id===destination.id" (click)="confirm()">CONFIRM BOOKING</ion-button></ion-card-content></ion-card></div></ion-content>`,
})
export class BookPage {
  places = PLACES;
  // Guard against a mock-data file that ever ships with fewer than 2 places.
  pickup: Place = PLACES[0];
  destination: Place = PLACES.length > 1 ? PLACES[1] : PLACES[0];

  constructor(
    private loc: LocationService,
    private fareSvc: FareService,
    private b: BookingService,
    private r: Router,
    private toast: ToastController,
  ) {}

  trackByPlaceId(_: number, p: Place) { return p.id; }

  distance() {
    return this.loc.distance(this.pickup, this.destination);
  }

  fare() {
    return this.fareSvc.calculate(this.distance());
  }

  async confirm(): Promise<void> {
    const b = this.b.create(this.pickup, this.destination);
    const t = await this.toast.create({ message: 'Booking ' + b.id + ' created. Searching for a driver...', duration: 1500, color: 'success' });
    await t.present();
    this.r.navigateByUrl('/commuter/tracking');
  }
}