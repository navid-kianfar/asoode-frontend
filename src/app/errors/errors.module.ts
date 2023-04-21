import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NoApiFoundComponent } from './pages/no-api-found/no-api-found.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


@NgModule({
  declarations: [
    NoApiFoundComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    SharedModule
  ],
  exports: [
    NoApiFoundComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
  ]
})
export class ErrorsModule { }
