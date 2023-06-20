import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ProfileRoutingModule
  ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule { }
