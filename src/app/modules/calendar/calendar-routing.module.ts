import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModuleComponent } from './calendar.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarModuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
