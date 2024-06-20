import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

interface CalendarDay {
  date: Date;
  appointments: Appointment[];
}

interface Appointment {
  title: string;
  date: Date;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  appointments: Appointment[] = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    
    this.calendarDays = [];
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      this.calendarDays.push({
        date: new Date(date),
        appointments: this.appointments.filter(app => app.date.toDateString() === date.toDateString())
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '250px',
      data: {date: new Date()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointments.push({ title: result.title, date: result.date });
        this.generateCalendar();
      }
    });
  }

  deleteAppointment(date: Date): void {
    this.appointments = this.appointments.filter(app => app.date.toDateString() !== date.toDateString());
    this.generateCalendar();
  }

  drop(event: CdkDragDrop<Appointment[]>, date: Date): void {
    moveItemInArray(this.calendarDays, event.previousIndex, event.currentIndex);
    this.generateCalendar();
  }
}
