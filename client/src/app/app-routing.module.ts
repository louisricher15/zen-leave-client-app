import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { UserTokenResolver } from './services/resolvers/user-token.resolver';

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
    resolve: {
      userTokenDecoded: UserTokenResolver,
    },
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'leave-creation',
    canActivate: [AuthGuard],
    resolve: {
      userTokenDecoded: UserTokenResolver,
    },
    loadChildren: () =>
      import('./leave-creation/leave-creation.module').then(
        (m) => m.LeaveCreationPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
