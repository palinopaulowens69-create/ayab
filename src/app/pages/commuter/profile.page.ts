import {Component} from '@angular/core';
import {IonicModule,AlertController} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>Profile</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card"><ion-item lines="none"><ion-avatar slot="start"><div style="width:100%;height:100%;display:grid;place-items:center;background:#7a0019;color:#fff;font-size:25px">{{auth.user()?.name?.[0]}}</div></ion-avatar><ion-label><h2>{{auth.user()?.name}}</h2><p>{{auth.user()?.email}}</p><p>{{auth.user()?.phone}}</p></ion-label></ion-item></ion-card><ion-button expand="block" color="danger" (click)="logout()">LOG OUT</ion-button></div></ion-content>`,
})
export class ProfilePage {
  constructor(public auth: AuthService, private alert: AlertController) {}

  // Previously bound straight to auth.logout() in the template, so a single
  // accidental tap on a full-width button would sign the user out instantly
  // with no way to undo it. Every other destructive action in the app
  // (settings.page.ts reset) confirms first — this brings logout in line.
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