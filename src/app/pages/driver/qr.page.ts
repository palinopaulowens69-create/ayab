import {Component,ElementRef,ViewChild,AfterViewInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import * as QRCode from 'qrcode';
import {AuthService} from '../../core/services/auth.service';
import {DriverService} from '../../core/services/driver.service';
import {Driver} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/driver/home"/></ion-buttons><ion-title>Driver QR</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card"><ion-card-header><ion-card-title>AYAB Driver QR</ion-card-title></ion-card-header><ion-card-content><div class="qr"><canvas #qr></canvas></div><h2 style="text-align:center">{{driver?.name}}</h2><p style="text-align:center">Plate: {{driver?.plate}}</p><p style="text-align:center"><b>{{driver?.qrId}}</b></p></ion-card-content></ion-card></div></ion-content>`,
})
export class DriverQrPage implements AfterViewInit {
  @ViewChild('qr', { static: true }) qr!: ElementRef<HTMLCanvasElement>;
  driver?: Driver;

  constructor(private a: AuthService, private ds: DriverService) {
    const user = this.a.user();
    this.driver = user ? this.ds.find(user.id) : undefined;
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.driver) return;
    try {
      await QRCode.toCanvas(this.qr.nativeElement, this.driver.qrId, { width: 240 });
    } catch (err) {
      console.error('Failed to render driver QR code', err);
    }
  }
}