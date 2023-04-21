import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './pages/project/project.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project/:id/archived',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: { archived: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
