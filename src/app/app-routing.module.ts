import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './modules/login/login/login.component';
import { UserloginComponent } from './modules/login/userlogin/userlogin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'adminlogin', component: LoginComponent },
  { path: 'login', component: UserloginComponent },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule),
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
      },

      {
        path: 'login',
        loadChildren: () =>
          import('./modules/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./modules/report/report.module').then((m) => m.ReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'unit',
        loadChildren: () =>
          import('./modules/unit-master/unit-master.module').then(
            (m) => m.UnitMasterModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'potholework',
        loadChildren: () =>
          import('./modules/pothole-work/pothole-work.module').then(
            (m) => m.PotholeWorkModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'module',
        loadChildren: () =>
          import('./modules/modulemaster/modulemaster.module').then(
            (m) => m.ModulemasterModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'pandmattribute',
        loadChildren: () =>
          import('./modules/pandmattribute/pandmattribute.module').then(
            (m) => m.PandmattributeModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'masticwork',
        loadChildren: () =>
          import('./modules/mastic-work/mastic-work.module').then(
            (m) => m.MasticWorkModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'ol',
        loadChildren: () =>
          import('./modules/open-layers/open-layers.module').then(
            (m) => m.OpenLayersModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./modules/locationmaster/locationmaster.module').then(
            (m) => m.LocationmasterModule
          ),
        canActivate: [AuthGuard],
      },
    
    ],
  },

  { path: '**', redirectTo: 'adminlogin' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {}
