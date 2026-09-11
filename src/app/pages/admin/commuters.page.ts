import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {USERS} from '../../../assets/mock/users';
import {BookingService} from '../../core/services/booking.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Commuters</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-searchbar [(ngModel)]="q" placeholder="Search commuters"/><ion-card class="card" *ngFor="let u of list(); trackBy: trackByUserId"><ion-item><ion-avatar slot="start"><div style="width:100%;height:100%;display:grid;place-items:center;background:#eee">{{u.name[0]}}</div></ion-avatar><ion-label><b>{{u.name}}</b><p>{{u.email}} · {{u.phone}}</p><p>{{count(u.id)}} trips · {{u.status}}</p></ion-label></ion-item></ion-card><div *ngIf="!list().length" class="empty">No commuters found.</div></div></ion-content>`,
})
export class AdminCommutersPage {
  q = '';

  constructor(private bs: BookingService) {}

  list() {
    const query = this.q.trim().toLowerCase();
    return USERS.filter(u => u.role === 'commuter' && u.name.toLowerCase().includes(query));
  }

  count(id: string): number {
    return this.bs.bookings().filter(b => b.passengerId === id).length;
  }

  trackByUserId(_: number, u: { id: string }) { return u.id; }
}