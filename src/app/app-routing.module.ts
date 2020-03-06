import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/reports/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { FilesComponent } from './pages/storage/files/files.component';
import { AnonymousGuard } from './guards/anonymous.guard';
import {MessengerComponent} from './pages/communication/messenger/messenger.component';
import {GroupComponent} from './pages/collaboration/group/group.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'files',
    component: FilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'messenger',
    component: MessengerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'group',
    component: GroupComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
