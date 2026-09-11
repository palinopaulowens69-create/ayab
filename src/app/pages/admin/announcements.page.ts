import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule,AlertController} from '@ionic/angular';
import {AdminService} from '../../core/services/admin.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Announcements</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-button expand="block" (click)="add()">CREATE ANNOUNCEMENT</ion-button><ion-card class="card" *ngFor="let a of admin.announcements(); trackBy: trackByAnnouncementId"><ion-card-header><ion-card-title>{{a.title}}</ion-card-title></ion-card-header><ion-card-content>{{a.body}}<ion-button fill="clear" color="danger" (click)="remove(a.id)">DELETE</ion-button></ion-card-content></ion-card><div *ngIf="!admin.announcements().length" class="empty">No announcements yet.</div></div></ion-content>`,
})
export class AdminAnnouncementsPage {
  constructor(public admin: AdminService, private alert: AlertController) {}

  trackByAnnouncementId(_: number, a: { id: string }) { return a.id; }

  async add(): Promise<void> {
    const a = await this.alert.create({
      header: 'New announcement',
      inputs: [
        { name: 'title', placeholder: 'Title' },
        { name: 'body', type: 'textarea', placeholder: 'Message' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Publish',
          handler: v => {
            const title = (v.title ?? '').trim();
            const body = (v.body ?? '').trim();
            if (title && body) this.admin.addAnnouncement(title, body);
          },
        },
      ],
    });
    await a.present();
  }


  async remove(id: string): Promise<void> {
    const a = await this.alert.create({
      header: 'Delete announcement?',
      message: 'This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => this.admin.deleteAnnouncement(id) },
      ],
    });
    await a.present();
  }
}