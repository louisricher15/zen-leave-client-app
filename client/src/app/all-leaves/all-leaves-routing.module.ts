import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllLeavesPage } from './all-leaves.page';

const routes: Routes = [
  {
    path: '',
    component: AllLeavesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllLeavesPageRoutingModule {}
