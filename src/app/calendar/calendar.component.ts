import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentDetailDialogComponent } from '../appointment-detail-dialog/appointment-detail-dialog.component';

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
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();
  calendarDays$: Observable<CalendarDay[]> = new Observable<CalendarDay[]>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const start = new Date();
    start.setDate(1);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);

    this.calendarDays$ = this.appointments$.pipe(
      map(appointments => {
        const days: CalendarDay[] = [];
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          days.push({
            date: new Date(date),
            appointments: appointments.filter(app => app.date.toDateString() === date.toDateString())
          });
        }
        return days;
      })
    );
  }

  openDialog(date?: Date): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      data: { date: date || new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentAppointments = this.appointmentsSubject.value;
        this.appointmentsSubject.next([...currentAppointments, { title: result.title, date: result.date }]);
        this.generateCalendar();
      }
    });
  }

  openDetailDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
      width: '500px',
      data: { appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'delete') {
          this.deleteAppointment(result.appointment);
        } else if (result.action === 'update') {
          const currentAppointments = this.appointmentsSubject.value.filter(app => app !== appointment);
          this.appointmentsSubject.next([...currentAppointments, result.appointment]);
          this.generateCalendar();
        }
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointmentsSubject.value.filter(app => app !== appointment);
    this.appointmentsSubject.next(currentAppointments);
    this.generateCalendar();
  }

  drop(event: CdkDragDrop<Appointment[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const droppedAppointment = event.container.data[event.currentIndex];
      const newDateString = event.container.element.nativeElement.getAttribute('data-date');
      if (newDateString) {
        droppedAppointment.date = new Date(newDateString);
      }
      this.generateCalendar();
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
}
