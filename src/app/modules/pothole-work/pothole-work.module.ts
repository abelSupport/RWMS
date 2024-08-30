import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PotholeWorkRoutingModule } from './pothole-work-routing.module';
import { ListPotholeWorkComponent } from './list-pothole-work/list-pothole-work.component';
import { CreatePotholeWorkComponent } from './create-pothole-work/create-pothole-work.component';
import {BtnCellRenderer} from './list-pothole-work/button-cell-renderer.component'
import { AgGridModule } from 'ag-grid-angular';
import { IconModule } from '@coreui/icons-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { GooglePotholeComplaintMapComponent } from './google-pothole-complaint-map/google-pothole-complaint-map.component'

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePotholeComplaintComponent } from './create-pothole-complaint/create-pothole-complaint.component';
import { PotholeComplaintFormComponent } from './pothole-complaint-form/pothole-complaint-form.component';
import {BeforeImageCellRenderer} from './list-pothole-work/before-image-cell-renderer.component'
import {AfterImageCellRenderer} from './list-pothole-work/after-image-cell-renderer.component'
import { AgmCoreModule } from '@agm/core';
import {MapOldTwitterImageCellRenderer} from './create-pothole-complaint/after-image-cell-renderer.component'
import {ListTwitterImageCellRenderer} from './list-pothole-work/twitter-image-cell-renderer.component'
import { MapTwitterImageCellRenderer } from './google-pothole-complaint-map/twitter-image-cell-renderer.component';
import { MapAfterImageCellRenderer } from './google-pothole-complaint-map/after-image-cell-renderer.component';
import { MapBeforeImageCellRenderer } from './google-pothole-complaint-map/before-image-cell-renderer.component';
import { GooglePotholeComplaintFormComponent } from './google-pothole-complaint-form/google-pothole-complaint-form.component';
import { DeleteBtnCellRenderer } from './google-pothole-complaint-map/delete-button-cell-renderer.component';
import { DeletePotholeWorkComponent } from './delete-pothole-work/delete-pothole-work.component';
import { BtnUpdateBeforeImageCellRenderer } from './list-pothole-work/update-images-cell-renderer.component';

@NgModule({
  declarations: [
    ListPotholeWorkComponent,
    CreatePotholeWorkComponent,
    BtnCellRenderer,
    CreatePotholeComplaintComponent,
    PotholeComplaintFormComponent,
    BeforeImageCellRenderer,
    AfterImageCellRenderer,
    BtnUpdateBeforeImageCellRenderer,
    MapOldTwitterImageCellRenderer,    
    GooglePotholeComplaintMapComponent,
    ListTwitterImageCellRenderer,
    MapTwitterImageCellRenderer,
    MapAfterImageCellRenderer,
    MapBeforeImageCellRenderer,
    GooglePotholeComplaintFormComponent,
    DeleteBtnCellRenderer,
    DeletePotholeWorkComponent
  ],
  imports: [
    CommonModule,
    PotholeWorkRoutingModule,
    AgGridModule,
    IconModule,
    DragDropModule,
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
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule,
    
  ]
})
export class PotholeWorkModule { }
