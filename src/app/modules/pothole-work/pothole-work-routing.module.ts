import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPotholeWorkComponent } from './list-pothole-work/list-pothole-work.component';
import { CreatePotholeWorkComponent } from './create-pothole-work/create-pothole-work.component';
import { CreatePotholeComplaintComponent } from './create-pothole-complaint/create-pothole-complaint.component';
import { GooglePotholeComplaintMapComponent } from './google-pothole-complaint-map/google-pothole-complaint-map.component';
import { DeletePotholeWorkComponent } from './delete-pothole-work/delete-pothole-work.component';

const routes: Routes = [
  { path: 'create', component: CreatePotholeWorkComponent },
  { path: 'list', component: ListPotholeWorkComponent },
  { path: 'create/:id', component: CreatePotholeWorkComponent },
  { path: 'delete', component: DeletePotholeWorkComponent },
  { path: 'map', component: CreatePotholeComplaintComponent },
  { path: 'gmap', component:GooglePotholeComplaintMapComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PotholeWorkRoutingModule { }
