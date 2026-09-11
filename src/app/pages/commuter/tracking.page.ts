import {Component,OnInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule,AlertController} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {BookingService} from '../../core/services/booking.service';
import {DriverService} from '../../core/services/driver.service';
import {NotificationService} from '../../core/services/notification.service';
import {Booking,Driver} from '../../core/models/models';
import {Subscription,interval} from 'rxjs';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  template: `<ion-header><ion-toolbar color="primary"><ion-title>Live Tracking</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngIf="booking"><ion-card-header><ion-card-title>{{title}}</ion-card-title><ion-card-subtitle>{{booking.id}}</ion-card-subtitle></ion-card-header><ion-card-content><div class="map"><div class="road"></div><div class="marker" style="left:72%;top:65%"></div><div class="marker" [class.driver-marker]="!!driver" [style.left.%]="driverX" [style.top.%]="driverY"></div></div><div style="margin-top:12px"><b>{{booking.pickup.name}}</b> → <b>{{booking.destination.name}}</b><p>Distance {{booking.distance}} km · Fare ₱{{booking.fare}}</p></div><ion-button *ngIf="booking.status==='accepted'" expand="block" (click)="verify()">VERIFY DRIVER QR</ion-button><ion-button *ngIf="booking.status==='verified'" expand="block" (click)="start()">START TRIP</ion-button><ion-button *ngIf="booking.status==='started'" expand="block" color="success" (click)="complete()">COMPLETE TRIP</ion-button><ion-button *ngIf="booking.status==='completed'" expand="block" routerLink="/commuter/history">VIEW TRIP & RATE</ion-button></ion-card-content></ion-card></div></ion-content>`,
})
export class TrackingPage implements OnInit, OnDestroy {
  booking?: Booking;
  driver?: Driver;
  title = 'Searching for Driver...';
  driverX = 20;
  driverY = 25;
  private sub?: Subscription;

  constructor(
    public b: BookingService,
    private ds: DriverService,
    private n: NotificationService,
    private alert: AlertController,
  ) {}

  ngOnInit(): void {
    this.refreshBooking();
    this.sub = interval(2500).subscribe(() => this.tick());
  }

  /**
   * Pulls the current state from BookingService. Picks the most recent
   * booking that hasn't finished yet, falling back to the latest booking
   * overall (e.g. right after completion, before the user navigates away).
   * Previously this always used byUser()[0], which meant an old completed
   * trip could permanently shadow a brand-new one.
   */
  private refreshBooking(): void {
    const bookings = this.b.byUser();
    this.booking = bookings.find(x => x.status !== 'completed') ?? bookings[0];
    this.driver = this.booking?.driverId ? this.ds.find(this.booking.driverId) : undefined;
  }

  tick(): void {
    if (!this.booking) return;
    if (this.booking.status === 'searching') {
      const d = this.ds.available()[0];
      if (d) {
        this.b.update(this.booking.id, 'accepted', d.id);
        this.refreshBooking();
        this.title = 'Driver Found!';
        if (this.booking) this.n.push(this.booking.passengerId, 'Your driver accepted your booking.');
      }
    } else if (this.booking.status === 'accepted') {
      this.title = 'Driver is arriving';
      this.driverX = Math.min(65, this.driverX + 10);
      this.driverY = Math.min(60, this.driverY + 6);
    } else if (this.booking.status === 'verified') {
      this.title = 'Ready to start trip';
    } else if (this.booking.status === 'started') {
      this.title = 'Trip in progress';
      this.driverX = Math.min(75, this.driverX + 4);
      this.driverY = Math.min(70, this.driverY + 2);
    } else if (this.booking.status === 'completed') {
      this.title = 'Trip completed';
    }
  }

  async verify(): Promise<void> {
    if (!this.booking) return;
    const a = await this.alert.create({
      header: 'QR Verification',
      message: 'Demo scanner detected AYAB-DRIVER-001. Verify this driver?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Verify',
          handler: () => {
            if (!this.booking) return;
            this.b.update(this.booking.id, 'verified', this.driver?.id);
            this.n.push(this.booking.passengerId, 'Driver QR verified. You can start your trip.');
            this.refreshBooking();
          },
        },
      ],
    });
    await a.present();
  }

  start(): void {
    if (!this.booking) return;
    this.b.update(this.booking.id, 'started', this.driver?.id);
    this.n.push(this.booking.passengerId, 'Your trip has started.');
    this.refreshBooking();
  }

  complete(): void {
    if (!this.booking) return;
    this.b.update(this.booking.id, 'completed', this.driver?.id);
    this.n.push(this.booking.passengerId, 'Your trip has been completed. Please rate your driver.');
    this.refreshBooking();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}