import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import {PotholeDashboardComponent} from './pothole-dashboard/pothole-dashboard.component'
import { VehicleDashboardComponent } from './vehicle-dashboard/vehicle-dashboard.component';
import { AllCookerStatusDataComponent } from './all-cooker-status-data/all-cooker-status-data.component';

const routes: Routes = [
  {
    path: '',
    component: PotholeDashboardComponent,
    data: {
      title: $localize`Dashboard`,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'cooker',
    component: DashboardComponent,
    data: {
      title: $localize`Dashboard`,
    },
    canActivate: [AuthGuard],
  },

  {
    path: 'Vehicledashboard',
    component: VehicleDashboardComponent,
    data: {
      title: $localize`Dashboard`,
    },
    // canActivate: [AuthGuard],
  },
  {
    path: 'allcookerstatusdata',
    component: AllCookerStatusDataComponent,
    data: {
      title: $localize`Dashboard`,
    },
    // canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
