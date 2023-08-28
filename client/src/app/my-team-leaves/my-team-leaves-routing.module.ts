import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTeamLeavesPage } from './my-team-leaves.page';

const routes: Routes = [
  {
    path: '',
    component: MyTeamLeavesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamLeavesPageRoutingModule {}
