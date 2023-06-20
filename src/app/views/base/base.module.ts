// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CardsComponent } from './cards.component';

// Forms Component
import { FormsComponent } from './forms.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsComponent } from './tabs.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoversComponent } from './popovers.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationsComponent } from './paginations.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProgressComponent } from './progress.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TooltipsComponent } from './tooltips.component';

// navbars
import { NavbarsComponent } from './navbars/navbars.component';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    CardsComponent,
    FormsComponent,
    TabsComponent,
    PaginationsComponent,
    PopoversComponent,
    ProgressComponent,
    TooltipsComponent,
    NavbarsComponent
  ]
})
export class BaseModule { }
