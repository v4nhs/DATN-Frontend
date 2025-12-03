import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // ✅ 5. Chuyển tất cả các route khác vào LÀM CON (children)
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'courses', loadChildren: () => import('./pages/courses/courses.routes').then(m => m.COURSES_ROUTES) },
      { path: 'lecturers', loadChildren: () => import('./pages/lecturers/lecturers.routes').then(m => m.LECTURERS_ROUTES) },
      { path: 'schedule', loadChildren: () => import('./pages/schedule/schedule.routes').then(m => m.SCHEDULE_ROUTES) },
      { path: 'assign', loadChildren: () => import('./pages/assign/assign.routes').then(m => m.ASSIGN_ROUTES) },
      { path: 'payment', loadChildren: () => import('./pages/payment/payment.routes').then(m => m.PAYMENT_ROUTES) },
      { path: 'payouts', loadChildren: () => import('./pages/payouts/payouts.routes').then(m => m.PAYOUTS_ROUTES) },
      { path: 'reports', loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES) },
      { path: 'settings', loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];