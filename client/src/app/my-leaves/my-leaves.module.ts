import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLeavesPageRoutingModule } from './my-leaves-routing.module';

import { MyLeavesPage } from './my-leaves.page';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLeavesPageRoutingModule,
    HeaderComponent,
  ],
  declarations: [MyLeavesPage],
})
export class MyLeavesPageModule {}
