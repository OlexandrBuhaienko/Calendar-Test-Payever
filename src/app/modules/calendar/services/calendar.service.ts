import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private datesSubject = new BehaviorSubject<Date[]>([]);
  dates$ = this.datesSubject.asObservable();

  setDates(dates: Date[]): void {
    this.datesSubject.next(dates);
  }
}
