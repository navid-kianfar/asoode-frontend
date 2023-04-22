import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './pages/group/group.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'group/:id',
    component: GroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'group/:id/archived',
    component: GroupComponent,
    canActivate: [AuthGuard],
    data: { archived: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
