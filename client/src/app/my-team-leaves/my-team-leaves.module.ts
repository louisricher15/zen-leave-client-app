import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTeamLeavesPageRoutingModule } from './my-team-leaves-routing.module';

import { MyTeamLeavesPage } from './my-team-leaves.page';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTeamLeavesPageRoutingModule,
    HeaderComponent,
  ],
  declarations: [MyTeamLeavesPage],
})
export class MyTeamLeavesPageModule {}
