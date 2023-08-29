import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'leave-creation',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./leave-creation/leave-creation.module').then(
        (m) => m.LeaveCreationPageModule,
      ),
  },
  {
    path: 'my-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./my-profile/my-profile.module').then(
        (m) => m.MyProfilePageModule,
      ),
  },
  {
    path: 'leave/:leaveID',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./leave/leave.module').then((m) => m.LeavePageModule),
  },
  {
    path: 'my-leaves',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./my-leaves/my-leaves.module').then((m) => m.MyLeavesPageModule),
  },
  {
    path: 'my-team-leaves',
    loadChildren: () => import('./my-team-leaves/my-team-leaves.module').then( m => m.MyTeamLeavesPageModule)
  },
  {
    path: 'all-leaves',
    loadChildren: () => import('./all-leaves/all-leaves.module').then( m => m.AllLeavesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
