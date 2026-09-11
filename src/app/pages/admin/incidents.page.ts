import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AdminService} from '../../core/services/admin.service';

// NOTE: shape inferred from template usage since models.ts wasn't provided.
// Adjust field names if AdminService's Incident type differs.
type IncidentStatus = 'Pending' | 'Investigating' | 'Resolved' | 'Closed';

interface Incident {
  id: string;
  title: string;
  passenger: string;
  driver: string;
  description: string;
  status: IncidentStatus;
  notes: string;
}

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `<ion-header><ion-toolbar color="primary"><ion-buttons slot="start"><ion-back-button defaultHref="/admin/dashboard"/></ion-buttons><ion-title>Incident Reports</ion-title></ion-toolbar></ion-header><ion-content><div class="page"><ion-card class="card" *ngFor="let i of admin.incidents(); trackBy: trackByIncidentId"><ion-card-header><ion-card-title>{{i.title}}</ion-card-title><ion-card-subtitle>{{i.passenger}} · {{i.driver}}</ion-card-subtitle></ion-card-header><ion-card-content><p>{{i.description}}</p><ion-select label="Status" [(ngModel)]="i.status" (ionChange)="update(i)"><ion-select-option *ngFor="let s of statuses" [value]="s">{{s}}</ion-select-option></ion-select><ion-textarea label="Notes" [(ngModel)]="i.notes" (ionChange)="update(i)"/></ion-card-content></ion-card><div *ngIf="!admin.incidents().length" class="empty">No incident reports.</div></div></ion-content>`,
})
export class AdminIncidentsPage {
  statuses: IncidentStatus[] = ['Pending', 'Investigating', 'Resolved', 'Closed'];

  constructor(public admin: AdminService) {}

  trackByIncidentId(_: number, i: Incident) { return i.id; }

  // change() and save() were separate methods with identical bodies, both
  // just calling admin.updateIncident(...) — consolidated into one.
  update(i: Incident): void {
    this.admin.updateIncident(i.id, i.status, i.notes);
  }
}