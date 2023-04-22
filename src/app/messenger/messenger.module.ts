import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessengerRoutingModule } from './messenger-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MessengerComponent } from './pages/messenger/messenger.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MessengerComponent
  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    SharedModule,
    MatTabsModule,
    MatRippleModule,
    FormsModule
  ],
  exports: [
    MessengerComponent
  ]
})
export class MessengerModule { }
