import { NgModule } from '@angular/core';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyHorizontalWrapper } from '../app/views/wrapper/horizontal-wrapper';
// Import routing module
import { AppRoutingModule } from './app-routing.module';
// import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
  AlertModule,
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { LoginModule } from './modules/login/login.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportModule } from './modules/report/report.module';
import { DbCallingService } from './core/services/db-calling.service';
import { LoadingService } from './core/services/loading.service';
import { LoadingInterceptor } from './core/services/loading.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AutoLogoutService } from './core/services/autologout.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingComponent } from '../app/loading/loading.component';
import { UnitMasterModule } from '../app/modules/unit-master/unit-master.module';
import { PandmattributeModule } from './modules/pandmattribute/pandmattribute.module';
import { DataentryModule } from './modules/dataentry/dataentry.module';
import { DashboardWidgetsModule } from './CustomViews/dashboard-widgets/dashboard-widgets.module';
import { RWMSReportsModule } from './modules/rwmsreports/rwmsreports.module';
import { OpenLayersModule } from './modules/open-layers/open-layers.module';
import { PotholeWorkModule } from './modules/pothole-work/pothole-work.module';
import { AgmCoreModule } from '@agm/core';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    ...APP_CONTAINERS,
    FormlyHorizontalWrapper,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    LoginModule,
    DashboardModule,
    DataentryModule,
    ReportModule,
    HttpClientModule,
    MatDialogModule,
    AlertModule,
    OverlayModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatToolbarModule,
    UnitMasterModule,
    PandmattributeModule,
    DashboardWidgetsModule,
    RWMSReportsModule,
    OpenLayersModule,
    PotholeWorkModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtIpdguq2MkWUFoHGHPmaZAFavkKFpcqc'
    }),
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      wrappers: [
        { name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
      ],
    }),
  ],
  providers: [
    IconSetService,
    DbCallingService,
    AutoLogoutService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },

    Title,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
