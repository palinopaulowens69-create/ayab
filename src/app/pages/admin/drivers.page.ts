import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {DriverService} from '../../core/services/driver.service';
import {Driver} from '../../core/models/models';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Driver Verification</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngFor="let d of ds.drivers(); trackBy: trackByDriverId"><ion-card-content><h2>{{d.name}}</h2><p>{{d.phone}} · {{d.email}}</p><p>{{d.tricycle}} · Plate {{d.plate}}</p><p>★ {{d.rating}} · {{d.completedTrips}} trips</p><ion-badge [color]="d.verified?'success':'warning'">{{d.verified?'VERIFIED':'PENDING'}}</ion-badge><div><ion-button color="success" (click)="ds.verify(d.id,true)">APPROVE</ion-button><ion-button color="danger" fill="outline" (click)="ds.verify(d.id,false)">REJECT</ion-button></div></ion-card-content></ion-card><div *ngIf="!ds.drivers().length" class="empty">No drivers registered.</div></div></ion-content>`,
})
export class AdminDriversPage {
  constructor(public ds: DriverService) {}

  trackByDriverId(_: number, d: Driver) { return d.id; }
}