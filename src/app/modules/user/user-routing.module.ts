import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateuserComponent } from './createuser/createuser.component';
import { UserlistComponent } from './userlist/userlist.component';
import { UserlocationComponent } from './userlocation/userlocation.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreatePotholeUserComponent } from './create-pothole-user/create-pothole-user.component';
import { ListPotholeUserComponent } from './list-pothole-user/list-pothole-user.component';

const routes: Routes = [
  { path: 'create', component: CreateuserComponent },
  { path: 'create/:id', component: CreateuserComponent },
  { path: 'list', component: UserlistComponent },
  { path: 'attachlocation/:id', component: UserlocationComponent },
  { path: 'changepassword/:id', component: ChangepasswordComponent },
  { path: 'potholecreate', component: CreatePotholeUserComponent },
  { path: 'potholecreate/:id', component: CreatePotholeUserComponent },
  { path: 'potholelist', component: ListPotholeUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
