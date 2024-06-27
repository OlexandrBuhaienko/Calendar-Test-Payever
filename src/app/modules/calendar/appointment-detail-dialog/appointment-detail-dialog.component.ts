import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-detail-dialog',
  templateUrl: './appointment-detail-dialog.component.html',
  styleUrls: ['./appointment-detail-dialog.component.css'],
})

export class AppointmentDetailDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    const appointmentDate = new Date(data.appointment.date);
    const hours = appointmentDate.getHours().toString().padStart(2, '0');
    const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    this.form = this.fb.group({
      title: [data.appointment.title, Validators.required],
      date: [appointmentDate, Validators.required],
      time: [time, Validators.required],
      notes: [data.appointment.notes || ''] // Додано поле для нотаток
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
        action: 'update',
        appointment: {
          title: this.form.get('title')?.value,
          date: date,
          notes: this.form.get('notes')?.value // Додаємо нотатки до збереження
        }
      });
    }
  }

  onDelete(): void {
    this.dialogRef.close({
      action: 'delete',
      appointment: this.data.appointment,
    });
  }
}
