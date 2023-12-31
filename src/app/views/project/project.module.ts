import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ProjectRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ ProjectComponent ]
})
export class ProjectModule { }
