import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AnonymousGuard } from './guards/anonymous.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotComponent } from './pages/forgot/forgot.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
