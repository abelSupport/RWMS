import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayOlMapComponent } from './display-ol-map/display-ol-map.component';
import { DigitizeRoadComponent } from './digitize-road/digitize-road.component';
import { GoogleMapComponent } from './google-map/google-map.component';

const routes: Routes = [
  { path: 'display', component: DisplayOlMapComponent },
  { path: 'display/:id', component: DisplayOlMapComponent },
  { path: 'digitize', component: DigitizeRoadComponent },
  { path: 'digitize/:id', component: DigitizeRoadComponent },
  { path: 'gmap', component: GoogleMapComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenLayersRoutingModule {}
