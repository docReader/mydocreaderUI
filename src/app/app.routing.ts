import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers/default-layout';
import { AuthenticationGuard } from './guard/authentication.guard';
import { CleanLayoutComponent} from './containers/clean-layout';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { LogoutComponent } from './views/logout/logout.component';
import { GHomeComponent } from './g-home/g-home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/g-home',
    pathMatch: 'full',
  },
  {
    path: 'g-home',
    component: GHomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dash',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'process/:id',
    redirectTo: 'process-mydoc/:id',
    pathMatch: 'full',
  },
  {
    path: 'prof',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard', canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'project/:id',canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'profile',canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'users',canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule)
      }
    ]
  },

 
  {
    path: '',
    component: CleanLayoutComponent,
    data: {
      title: 'Process'
    },
    children: [
      {
        path: 'process-mydoc/:id/:file', canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/process/process.module').then(m => m.ProcessModule)
      },
    ]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'home',
    component: GHomeComponent,
    data: {
      title: 'Home Page'
    }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Logout Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },

  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
