import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkPackageComponent } from './pages/work-package/work-package.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'work-package/:id',
    component: WorkPackageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'work-package/:id/archived',
    component: WorkPackageComponent,
    canActivate: [AuthGuard],
    data: { archived: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkpackageRoutingModule { }
