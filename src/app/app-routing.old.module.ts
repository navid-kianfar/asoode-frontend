// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { DashboardComponent } from './__/pages/reports/dashboard/dashboard.component';
// import { LoginComponent } from './__/pages/auth/login/login.component';
// import { AuthGuard } from './auth/guards/auth.guard';
// import { ForgotComponent } from './__/pages/auth/forgot/forgot.component';
// import { RegisterComponent } from './__/pages/auth/register/register.component';
// import { ProfileComponent } from './__/pages/account/profile/profile.component';
// import { FilesComponent } from './__/pages/storage/files/files.component';
// import { AnonymousGuard } from './auth/guards/anonymous.guard';
// import { MessengerComponent } from './__/pages/communication/messenger/messenger.component';
// import { GroupComponent } from './__/pages/collaboration/group/group.component';
// import { ProjectComponent } from './__/pages/project-management/project/project.component';
// import { WorkPackageComponent } from './__/pages/project-management/work-package/work-package.component';
// import { TasksComponent } from './__/pages/project-management/tasks/tasks.component';
//
// const routes: Routes = [
//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'files',
//     component: FilesComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'account',
//     component: ProfileComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'messenger',
//     component: MessengerComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'group/:id',
//     component: GroupComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'group/:id/archived',
//     component: GroupComponent,
//     canActivate: [AuthGuard],
//     data: { archived: true },
//   },
//   {
//     path: 'project/:id',
//     component: ProjectComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'project/:id/archived',
//     component: ProjectComponent,
//     canActivate: [AuthGuard],
//     data: { archived: true },
//   },
//   {
//     path: 'work-package/:id',
//     component: WorkPackageComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'work-package/:id/archived',
//     component: WorkPackageComponent,
//     canActivate: [AuthGuard],
//     data: { archived: true },
//   },
//   {
//     path: 'tasks',
//     component: TasksComponent,
//     canActivate: [AuthGuard],
//   },
//   { path: '**', redirectTo: 'dashboard' },
// ];
//
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
