import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanResourceRoutingModule } from './human-resource-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HumanResourcesComponent } from './pages/human-resources/human-resources.component';


@NgModule({
  declarations: [
    HumanResourcesComponent
  ],
  imports: [
    CommonModule,
    HumanResourceRoutingModule,
    SharedModule
  ],
  exports: [
    HumanResourcesComponent
  ]
})
export class HumanResourceModule { }
