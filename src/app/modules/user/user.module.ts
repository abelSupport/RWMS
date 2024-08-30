import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { UserRoutingModule } from './user-routing.module';
import { UserlistComponent } from './userlist/userlist.component';
import { CreateuserComponent } from './createuser/createuser.component';
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
import { IconModule } from '@coreui/icons-angular';
import { AgGridModule } from 'ag-grid-angular';
import { UserlocationComponent } from './userlocation/userlocation.component';
import { BtnCellRenderer } from './userlist/button-cell-renderer.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreatePotholeUserComponent } from './create-pothole-user/create-pothole-user.component';
import { ListPotholeUserComponent } from './list-pothole-user/list-pothole-user.component';
import { BtnCellRendererPothole } from './list-pothole-user/button-cell-renderer.component';

@NgModule({
  declarations: [
    UserlistComponent,
    CreateuserComponent,
    UserlocationComponent,
    BtnCellRenderer,
    ChangepasswordComponent,
    CreatePotholeUserComponent,
    ListPotholeUserComponent,
    BtnCellRendererPothole,
    
  ],
  imports: [
    CommonModule,
    IconModule,
    AgGridModule,
    UserRoutingModule,
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
    DragDropModule,
  ],
})
export class UserModule {}
