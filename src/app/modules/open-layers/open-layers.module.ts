import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { OpenLayersRoutingModule } from './open-layers-routing.module';
import { DisplayOlMapComponent } from './display-ol-map/display-ol-map.component';
import { DigitizeRoadComponent } from './digitize-road/digitize-road.component';
import { AddLineStringComponent } from './add-line-string/add-line-string.component';
import { AgmCoreModule } from '@agm/core';
import { IconModule } from '@coreui/icons-angular';
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
import { MapFeatureComponent } from './map-feature/map-feature.component';
import { PlantexVtsFeatureComponent } from './plantex-vts-feature/plantex-vts-feature.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { MasticPlantFeatureComponent } from './mastic-plant-feature/mastic-plant-feature.component';

@NgModule({
  declarations: [
    DisplayOlMapComponent,
    DigitizeRoadComponent,
    AddLineStringComponent,
    MapFeatureComponent,
    PlantexVtsFeatureComponent,
    GoogleMapComponent,
    MasticPlantFeatureComponent,
  ],
  exports: [DisplayOlMapComponent],
  imports: [
    AgmCoreModule,
    CommonModule,
    OpenLayersRoutingModule,
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
    AgGridModule,
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
    IconModule,
  ],
})
export class OpenLayersModule {}
