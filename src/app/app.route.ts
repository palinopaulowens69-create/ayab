import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage),
  },
  {
    path: 'commuter',
    canActivate: [roleGuard('commuter')],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./pages/commuter/home.page').then(m => m.CommuterHomePage) },
      { path: 'book', loadComponent: () => import('./pages/commuter/book.page').then(m => m.BookPage) },
      { path: 'tracking', loadComponent: () => import('./pages/commuter/tracking.page').then(m => m.TrackingPage) },
      { path: 'history', loadComponent: () => import('./pages/commuter/history.page').then(m => m.HistoryPage) },
      { path: 'notifications', loadComponent: () => import('./pages/commuter/notifications.page').then(m => m.NotificationsPage) },
      { path: 'profile', loadComponent: () => import('./pages/commuter/profile.page').then(m => m.ProfilePage) },
      { path: 'qr', loadComponent: () => import('./pages/commuter/qr.page').then(m => m.CommuterQrPage) },
      { path: 'settings', loadComponent: () => import('./pages/commuter/settings.page').then(m => m.SettingsPage) },
    ],
  },
  {
    path: 'driver',
    canActivate: [roleGuard('driver')],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./pages/driver/home.page').then(m => m.DriverHomePage) },
      { path: 'requests', loadComponent: () => import('./pages/driver/requests.page').then(m => m.DriverRequestsPage) },
      { path: 'trip', loadComponent: () => import('./pages/driver/trip.page').then(m => m.DriverTripPage) },
      { path: 'history', loadComponent: () => import('./pages/driver/history.page').then(m => m.DriverHistoryPage) },
      { path: 'profile', loadComponent: () => import('./pages/driver/profile.page').then(m => m.DriverProfilePage) },
      { path: 'qr', loadComponent: () => import('./pages/driver/qr.page').then(m => m.DriverQrPage) },
    ],
  },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard.page').then(m => m.AdminDashboardPage) },
      { path: 'profile', loadComponent: () => import('./pages/admin/admin-profile.page').then(m => m.AdminProfilePage) },
      { path: 'drivers', loadComponent: () => import('./pages/admin/drivers.page').then(m => m.AdminDriversPage) },
      { path: 'bookings', loadComponent: () => import('./pages/admin/bookings.page').then(m => m.AdminBookingsPage) },
      { path: 'commuters', loadComponent: () => import('./pages/admin/commuters.page').then(m => m.AdminCommutersPage) },
      { path: 'incidents', loadComponent: () => import('./pages/admin/incidents.page').then(m => m.AdminIncidentsPage) },
      { path: 'announcements', loadComponent: () => import('./pages/admin/announcements.page').then(m => m.AdminAnnouncementsPage) },
      { path: 'reports', loadComponent: () => import('./pages/admin/reports.page').then(m => m.AdminReportsPage) },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
