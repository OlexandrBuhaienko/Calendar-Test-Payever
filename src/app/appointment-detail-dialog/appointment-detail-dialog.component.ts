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
    this.form = this.fb.group({
      title: [data.appointment.title, Validators.required],
      date: [data.appointment.date, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        action: 'update',
        appointment: { title: this.form.get('title')?.value, date: this.form.get('date')?.value }
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
