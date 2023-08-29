import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllLeavesPageRoutingModule } from './all-leaves-routing.module';

import { AllLeavesPage } from './all-leaves.page';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllLeavesPageRoutingModule,
    HeaderComponent,
  ],
  declarations: [AllLeavesPage],
})
export class AllLeavesPageModule {}
