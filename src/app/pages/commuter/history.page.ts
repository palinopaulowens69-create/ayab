import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule,AlertController} from '@ionic/angular';
import {BookingService} from '../../core/services/booking.service';
import {DriverService} from '../../core/services/driver.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>Trip History</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngFor="let b of bookings.byUser(); trackBy: trackByBookingId"><ion-item lines="none"><ion-label><b>{{b.pickup.name}} → {{b.destination.name}}</b><p>{{b.createdAt|date:'medium'}} · ₱{{b.fare}}</p><p *ngIf="driverName(b)">Driver: {{driverName(b)}}</p><ion-badge>{{b.status}}</ion-badge><p *ngIf="b.rating">{{'★'.repeat(b.rating)}} {{b.review}}</p></ion-label><ion-button *ngIf="b.status==='completed'&&!b.rating" (click)="rate(b.id)">RATE</ion-button></ion-item></ion-card><div *ngIf="!bookings.byUser().length" class="empty">No trips yet.</div></div></ion-content>`,
})
export class HistoryPage {
  constructor(public bookings: BookingService, private d: DriverService, private a: AlertController) {}

  // DriverService was injected in the original but never referenced, so the
  // driver's name never showed up despite bookings carrying a driverId.
  driverName(b: { driverId?: string }): string | undefined {
    return b.driverId ? this.d.find(b.driverId)?.name : undefined;
  }

  trackByBookingId(_: number, b: { id: string }) { return b.id; }

  async rate(id: string): Promise<void> {
    const a = await this.a.create({
      header: 'Rate Driver',
      inputs: [1, 2, 3, 4, 5].map(x => ({ type: 'radio', label: x + ' ★', value: x, checked: x === 5 })),
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Submit', handler: (v) => { this.bookings.addRating(id, Number(v), 'Good ride!'); } },
      ],
    });
    await a.present();
  }
}