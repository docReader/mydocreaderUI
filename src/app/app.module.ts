import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { CleanLayoutComponent } from './containers/clean-layout/clean-layout.component';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
//import { LoginModule } from './views/login/login.module';
import { RegisterComponent } from './views/register/register.component';
import { LogoutComponent } from './views/logout/logout.component';
import { ProcessModule } from './views/process/process.module';
import { ProfileModule } from './views/profile/profile.module';
import { ProjectModule } from './views/project/project.module';
import { UsersModule } from './views/users/users.module';
import { CustomHeaderComponent } from './views/custom-header/custom-header.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent, CleanLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { LoginService } from './views/login/login.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SafeHtmlPipe } from './views/common/pipe.safehtml';
import { GHomeComponent } from './g-home/g-home.component';
import { LoginComponent } from './views/login/login.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
   // LoginModule,
    ProcessModule,
    ProfileModule,
    ProjectModule,
    UsersModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    RegisterComponent,
    CustomHeaderComponent,
    LogoutComponent,
    SafeHtmlPipe,
    GHomeComponent,
    LoginComponent
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    IconSetService,
    LoginService, AuthenticationGuard
   // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: false}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
