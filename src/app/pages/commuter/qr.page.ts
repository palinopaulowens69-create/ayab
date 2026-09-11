import {Component,AfterViewInit,ElementRef,ViewChild} from '@angular/core';
import {IonicModule,AlertController} from '@ionic/angular';
import * as QRCode from 'qrcode';
import {DriverService} from '../../core/services/driver.service';
import {BookingService} from '../../core/services/booking.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>QR Scanner</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><div class="hero"><h1>Scan Driver QR</h1><p>Verify the driver's unique AYAB code before starting the ride.</p></div><ion-card class="card"><ion-card-content><div style="height:260px;border:3px dashed #7a0019;border-radius:20px;display:grid;place-items:center">Camera preview unavailable in demo mode</div><ion-button expand="block" size="large" (click)="simulate()">SIMULATE SCAN</ion-button></ion-card-content></ion-card><canvas #canvas class="qr"></canvas></div></ion-content>`,
})
export class CommuterQrPage implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private d: DriverService, private b: BookingService, private a: AlertController) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await QRCode.toCanvas(this.canvas.nativeElement, 'AYAB-DEMO-SCAN');
    } catch (err) {
      // Don't let a canvas render failure silently break the page.
      console.error('Failed to render QR code', err);
    }
  }

  async simulate(): Promise<void> {
    const d = this.d.available()[0];
    const b = this.b.byUser()[0];
    if (!d || !b) {
      const a = await this.a.create({ header: 'No active booking', message: 'Create a ride first.', buttons: ['OK'] });
      await a.present();
      return;
    }
    const a = await this.a.create({
      header: 'QR detected',
      message: d.qrId + ' belongs to ' + d.name + '. Verify driver?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Verify', handler: () => this.b.update(b.id, 'verified', d.id) },
      ],
    });
    await a.present();
  }
}