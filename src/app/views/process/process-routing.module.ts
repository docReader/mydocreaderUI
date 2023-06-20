import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
    data: {
      title: 'Process'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule {}
