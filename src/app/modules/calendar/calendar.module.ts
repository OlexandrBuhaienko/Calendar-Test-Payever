//import { CalendarModule } from './calendar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModuleComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { AppointmentDetailDialogComponent } from './appointment-detail-dialog/appointment-detail-dialog.component';


@NgModule({
  declarations: [
    CalendarModuleComponent,
    AppointmentDialogComponent,
    AppointmentDetailDialogComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  exports: [
     CalendarModuleComponent, AppointmentDialogComponent, AppointmentDetailDialogComponent
  ]
})
export class CalendarModule { }
