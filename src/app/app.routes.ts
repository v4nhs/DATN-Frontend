import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login',         loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES) },
  { path: 'dashboard',     loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
  { path: 'courses',       loadChildren: () => import('./pages/courses/courses.routes').then(m => m.COURSES_ROUTES) },
  { path: 'rooms',         loadChildren: () => import('./pages/rooms/rooms.routes').then(m => m.ROOMS_ROUTES) },
  { path: 'lecturers',     loadChildren: () => import('./pages/lecturers/lecturers.routes').then(m => m.LECTURERS_ROUTES) },
  { path: 'exam-sessions', loadChildren: () => import('./pages/exam-sessions/exam-sessions.routes').then(m => m.EXAM_SESSIONS_ROUTES) },
  { path: 'schedule',      loadChildren: () => import('./pages/schedule/schedule.routes').then(m => m.SCHEDULE_ROUTES) },
  { path: 'assign',        loadChildren: () => import('./pages/assign/assign.routes').then(m => m.ASSIGN_ROUTES) },
  { path: 'payment',       loadChildren: () => import('./pages/payment/payment.routes').then(m => m.PAYMENT_ROUTES) },
  { path: 'payouts',       loadChildren: () => import('./pages/payouts/payouts.routes').then(m => m.PAYOUTS_ROUTES) },
  { path: 'reports',       loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES) },
  { path: 'settings',      loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
  // 404
  { path: '**', redirectTo: 'login' }
];
