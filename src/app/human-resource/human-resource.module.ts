import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanResourceRoutingModule } from './human-resource-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HumanResourceRoutingModule,
    SharedModule
  ]
})
export class HumanResourceModule { }
