import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    FormsModule,
    NgxPaginationModule,
    UsersRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ UsersComponent ]
})
export class UsersModule { }
