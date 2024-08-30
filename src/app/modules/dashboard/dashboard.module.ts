import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { AgGridModule } from 'ag-grid-angular';

import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule,
} from '@coreui/angular';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from '../../views/widgets/widgets.module';
import { BaseModule } from '../../views/base/base.module';
import { NgChartsModule } from 'ng2-charts';
import { BtnCellRenderer } from './dashboard/button-cell-renderer.component';
import {OpenLayersModule} from './../open-layers/open-layers.module'
import { WeightedCellRendererComponent } from './dashboard/weighted-cell-renderer.component';
import { DashboardWidgetsModule } from '../../CustomViews/dashboard-widgets/dashboard-widgets.module';
import { PotholeDashboardComponent } from './pothole-dashboard/pothole-dashboard.component';
import { VehicleDashboardComponent } from './vehicle-dashboard/vehicle-dashboard.component';
import { CookersStatusListComponent } from './cookers-status-list/cookers-status-list.component';
import { ListTwitterImageCellRenderer } from './cookers-status-list/twitter-image-cell-renderer.component';
import { AllCookerStatusDataComponent } from './all-cooker-status-data/all-cooker-status-data.component';
import { ImageCellRenderer } from './all-cooker-status-data/image-cell-renderer.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BtnCellRenderer,
    WeightedCellRendererComponent,
    PotholeDashboardComponent,
    VehicleDashboardComponent,
    CookersStatusListComponent,
    ListTwitterImageCellRenderer,
    AllCookerStatusDataComponent,
    ImageCellRenderer
  ],
  imports: [
    CommonModule,
    OpenLayersModule,
    NgChartsModule,
    NavModule,
    TabsModule,
    DashboardRoutingModule,
    FormsModule,
    WidgetsModule,
    BaseModule,
    ButtonModule,
    DashboardWidgetsModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CollapseModule,
    DropdownModule,
    FormModule,
    ReactiveFormsModule,
    GridModule,
    ListGroupModule,
    NavModule,
    PaginationModule,
    PlaceholderModule,
    PopoverModule,
    ProgressModule,
    SharedModule,
    SpinnerModule,
    TableModule,
    TabsModule,
    TooltipModule,
    AgGridModule,
    UtilitiesModule,
    IconModule,
  ],
})
export class DashboardModule {}
