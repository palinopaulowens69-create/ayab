export type Role='commuter'|'driver'|'admin';
export type BookingStatus='searching'|'accepted'|'verified'|'arrived'|'started'|'completed'|'cancelled';
export interface User{id:string;name:string;email:string;password:string;role:Role;phone:string;status:'active'|'suspended'}
export interface Driver extends User{role:'driver';rating:number;completedTrips:number;plate:string;tricycle:string;qrId:string;online:boolean;verified:boolean;lat:number;lng:number;eta:number}
export interface Place{id:string;name:string;lat:number;lng:number}
export interface Booking{id:string;passengerId:string;passengerName:string;driverId?:string;pickup:Place;destination:Place;distance:number;fare:number;status:BookingStatus;createdAt:string;rating?:number;review?:string}
export interface Trip extends Booking{startedAt?:string;completedAt?:string}
export interface Review{id:string;driverId:string;driverName:string;passengerName:string;rating:number;review:string;date:string}
export interface Incident{id:string;title:string;passenger:string;driver:string;description:string;status:'Pending'|'Investigating'|'Resolved'|'Closed';notes:string;date:string}
export interface Announcement{id:string;title:string;body:string;published:boolean;date:string}
export interface Notification{id:string;userId:string;message:string;read:boolean;date:string}