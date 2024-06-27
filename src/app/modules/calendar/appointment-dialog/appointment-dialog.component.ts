import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentDetailDialogComponent } from '../appointment-detail-dialog/appointment-detail-dialog.component';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css'],
})


export class AppointmentDialogComponent {
  form: FormGroup;
  isExistingAppointment: boolean;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.isExistingAppointment = data.appointment ? true : false;

    this.form = this.fb.group({
      title: [{ value: data.appointment?.title || '', disabled: this.isExistingAppointment }, Validators.required],
      date: [{ value: data.date || new Date(), disabled: this.isExistingAppointment }, Validators.required],
      time: [{ value: this.isExistingAppointment ? this.formatTime(data.appointment.date) : '', disabled: this.isExistingAppointment }, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const date = new Date(this.form.get('date')?.value);
      const time = this.form.get('time')?.value.split(':');
      date.setHours(time[0], time[1]);
      this.dialogRef.close({
        title: this.form.get('title')?.value,
        date: date
      });
    }
  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
      width: '500px',
      data: { appointment: { title: this.form.get('title')?.value, date: new Date(this.form.get('date')?.value) } }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }

  onDelete(): void {
    this.dialogRef.close({
      action: 'delete',
      appointment: { title: this.form.get('title')?.value, date: new Date(this.form.get('date')?.value) }
    });
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
