import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailDialogComponent } from './appointment-detail-dialog/appointment-detail-dialog.component'; 
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { Time } from '@angular/common';

interface CalendarDay {
  date: Date;
  appointments: Appointment[];
}

interface Appointment {
  title: string;
  date: Date;
  time: Time;
  notes?: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarModuleComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  appointmentForm!: FormGroup;
  isEditMode = false;
  currentAppointment ?: Appointment;

  @Input() date: Date = new Date();
  @Input() appointments: Appointment[] = [];
  @Output() dateChange = new EventEmitter<Date>();
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>(
    this.appointments
  );
  appointments$ = this.appointmentsSubject.asObservable();
  calendarDays$: Observable<CalendarDay[]> = new Observable<CalendarDay[]>();

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.appointmentForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }
  
  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const start = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);

    this.calendarDays$ = this.appointments$.pipe(
      map((appointments) => {
        const days: CalendarDay[] = [];
        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          days.push({
            date: new Date(date),
            appointments: appointments.filter(
              (app) => app.date.toDateString() === date.toDateString()
            ),
          });
        }
        return days;
      })
    );
  }

  openDialog(date: Date): void {
    // const dialogRef = this.dialog.open(AppointmentDialogComponent, {
    //   width: '500px',
    //   data: { form: this.appointmentForm },
      
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     const currentAppointment = this.appointmentsSubject.value;
    //     this.appointmentsSubject.next([
    //       ...currentAppointment,
    //       { title: result.title, date: result.date, notes: result.notes },
    //     ]);
    //     this.generateCalendar();
    //   }
    // });
    this.isEditMode = false;
    this.appointmentForm?.reset();
    this.appointmentForm?.patchValue({ date });
    this.dialog.open(this.dialogTemplate);
  }

  openDetailDialog(appointment: Appointment): void {
    // const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
    //   width: '500px',
    //   data: { appointment },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     if (result.action === 'delete') {
    //       this.deleteAppointment(result.appointment);
    //     } else if (result.action === 'update') {
    //       const currentAppointments = this.appointmentsSubject.value.filter(
    //         (app) => app !== appointment
    //       );
    //       this.appointmentsSubject.next([
    //         ...currentAppointments,
    //         result.appointment,
    //       ]);
    //     }
    //     this.generateCalendar();
    //   }
    // });
    this.isEditMode = true;
    this.currentAppointment = appointment;
    this.appointmentForm?.reset();
    this.appointmentForm?.patchValue({
      title: appointment.title,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes
    });
    this.dialog.open(this.dialogTemplate);
  }

  onFormSubmit(): void {
    if (this.appointmentForm?.valid) {
      const formValue = this.appointmentForm?.value;
      const newAppointment: Appointment = {
        title: formValue.title,
        date: new Date(formValue.date),
        time: formValue.time,
        notes: formValue.notes
      };

      if (this.isEditMode && this.currentAppointment) {
        const index = this.appointments.findIndex(app => app === this.currentAppointment);
        this.appointments[index] = newAppointment;
      } else {
        this.appointments.push(newAppointment);
      }

      this.appointmentsSubject.next(this.appointments);
      this.generateCalendar();
      this.dialog.closeAll();
    }
  }
  onCancel(): void {
    this.dialog.closeAll();
  }

  onDelete(): void {
    if (this.currentAppointment) {
      this.deleteAppointment(this.currentAppointment);
      this.dialog.closeAll();
    }
  }

  deleteAppointment(appointment: Appointment): void {
    // const currentAppointments = this.appointmentsSubject.value.filter(
    //   (app) => app !== appointment
    // );
    // this.appointmentsSubject.next(currentAppointments);
    // this.generateCalendar();
    this.appointments = this.appointments.filter(app => app !== appointment);
    this.appointmentsSubject.next(this.appointments);
    this.generateCalendar();
  }

  drop(event: CdkDragDrop<Appointment[]>, day: CalendarDay): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const droppedAppointment = event.container.data[event.currentIndex];
      const newDate = new Date(day.date);
      newDate.setHours(
        droppedAppointment.date.getHours(),
        droppedAppointment.date.getMinutes()
      );
      droppedAppointment.date = newDate;
      this.generateCalendar();
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previousMonth(): void {
    const newDate = new Date(this.date);
    newDate.setMonth(newDate.getMonth() - 1);
    this.date = newDate;
    this.dateChange.emit(this.date);
    this.generateCalendar();
  }

  nextMonth(): void {
    const newDate = new Date(this.date);
    newDate.setMonth(newDate.getMonth() + 1);
    this.date = newDate;
    this.dateChange.emit(this.date);
    this.generateCalendar();
  }
}
