import { Component } from '@angular/core';

// interface Appointment {
//   title: string;
//   date: Date;
//   notes?: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dates: Date[] = [];
  currentDate: Date = new Date();

  constructor() {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    this.dates.push(date);
    }
    updateCurrentDate(date: Date): void {
      this.currentDate = date;
    }
  }
