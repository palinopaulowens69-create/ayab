import {Component} from '@angular/core';
import {IonicModule, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"></ion-back-button></ion-buttons><ion-title>Admin Profile</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card"><ion-item lines="none"><ion-avatar slot="start"><div style="width:100%;height:100%;display:grid;place-items:center;background:#7a0019;color:#fff;font-size:25px">{{ (auth.user()?.name?.[0]) || '?' }}</div></ion-avatar><ion-label><h2>{{ auth.user()?.name || 'Unknown' }}</h2><p>{{ auth.user()?.email || '' }}</p><ion-badge color="primary">ADMIN</ion-badge></ion-label></ion-item></ion-card><ion-button expand="block" color="danger" (click)="logout()">LOG OUT</ion-button></div></ion-content>`,
})
export class AdminProfilePage {
  constructor(
    public auth: AuthService,
    private alert: AlertController,
    private router: Router,
  ) {}

  async logout(): Promise<void> {
    const a = await this.alert.create({
      header: 'Log Out?',
      message: 'You will need to sign in again to continue.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Log Out',
          role: 'destructive',
          handler: () => {
            this.auth.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });
    await a.present();
  }
}