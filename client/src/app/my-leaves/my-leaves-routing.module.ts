import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLeavesPage } from './my-leaves.page';

const routes: Routes = [
  {
    path: '',
    component: MyLeavesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLeavesPageRoutingModule {}
