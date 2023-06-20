import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProcessComponent } from './process.component';
import { ProcessService } from './process.service';
import { ProcessRoutingModule } from './process-routing.module';
import { CommonModule } from '@angular/common';
import { NgxTinymceModule } from 'ngx-tinymce';

@NgModule({
  imports: [
    FormsModule,
    ProcessRoutingModule,
    CommonModule,
    NgxTinymceModule.forRoot({
      baseURL: '/assets/tinymce/',
    }),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [ ProcessComponent ]
})
export class ProcessModule { }
