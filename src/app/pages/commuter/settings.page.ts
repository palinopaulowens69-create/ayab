import {Component,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule,AlertController} from '@ionic/angular';
import {StorageService} from '../../core/services/storage.service';
import {Router} from '@angular/router';

@Component({
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>Settings</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-list><ion-item><ion-toggle [(ngModel)]="notifications" (ionChange)="onToggleNotifications()">Notifications</ion-toggle></ion-item><ion-item><ion-label><b>Demo Mode</b><p>All data is stored locally.</p></ion-label></ion-item></ion-list><ion-button expand="block" color="warning" (click)="reset()">RESET DEMO DATA</ion-button></div></ion-content>`,
})
export class SettingsPage implements OnInit {
  // NOTE: assumes StorageService exposes get(key)/set(key,value)/clear() with
  // string values, matching its use in reset() below. Adjust the key names
  // if StorageService uses a different API shape.
  private static readonly NOTIFICATIONS_KEY = 'settings.notifications';

  notifications = true;

  constructor(private s: StorageService, private r: Router, private a: AlertController) {}

  ngOnInit(): void {
    const stored = this.s.get(SettingsPage.NOTIFICATIONS_KEY, 'true');
    this.notifications = stored !== null && stored !== undefined ? stored === 'true' : true;
  }

  onToggleNotifications(): void {
    this.s.set(SettingsPage.NOTIFICATIONS_KEY, String(this.notifications));
  }

  async reset(): Promise<void> {
    const x = await this.a.create({
      header: 'Reset Demo Data?',
      message: 'This clears local AYAB state and returns to login.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Reset', handler: () => { this.s.clear(); this.r.navigateByUrl('/login'); } },
      ],
    });
    await x.present();
  }
}