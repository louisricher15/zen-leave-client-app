import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveCreationPageRoutingModule } from './leave-creation-routing.module';

import { LeaveCreationPage } from './leave-creation.page';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveCreationPageRoutingModule,
    ReactiveFormsModule,
    HeaderComponent,
  ],
  declarations: [LeaveCreationPage],
})
export class LeaveCreationPageModule {}
