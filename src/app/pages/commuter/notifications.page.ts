import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AuthService} from '../../core/services/auth.service';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/commuter/home"/></ion-buttons><ion-title>Notifications</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-list><ion-item *ngFor="let n of notifications(); trackBy: trackById"><ion-label>{{n.message}}<p>{{n.date|date:'short'}}</p></ion-label></ion-item></ion-list><div *ngIf="!notifications().length" class="empty">No notifications yet.</div></div></ion-content>`,
})
export class NotificationsPage {
  constructor(public auth: AuthService, public ns: NotificationService) {}

  /**
   * Was previously `ns.forUser(auth.user()!.id)` directly in the template,
   * which throws if user() is ever null (e.g. a moment during logout).
   * Also now sorts newest-first, which the original didn't guarantee.
   */
  notifications() {
    const user = this.auth.user();
    if (!user) return [];
    return this.ns
      .forUser(user.id)
      .slice()
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  // NOTE: assumes notification objects expose an `id` field; adjust if your
  // NotificationService model uses a different unique key.
  trackById(_: number, n: { id?: string }) {
    return n.id;
  }
}