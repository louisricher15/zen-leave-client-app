import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveCreationPage } from './leave-creation.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveCreationPageRoutingModule {}
