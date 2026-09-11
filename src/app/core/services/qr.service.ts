import {Injectable} from '@angular/core';
@Injectable({providedIn:'root'}) export class QrService{createDriverCode(driverId:string){return 'AYAB-DRIVER-'+driverId.replace(/\D/g,'').padStart(3,'0')} isValid(code:string){return /^AYAB-DRIVER-\d{3}$/.test(code)}}
