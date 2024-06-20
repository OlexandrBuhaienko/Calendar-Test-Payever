import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarModuleComponent } from './calendar-module.component';

describe('CalendarModuleComponent', () => {
  let component: CalendarModuleComponent;
  let fixture: ComponentFixture<CalendarModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarModuleComponent]
    });
    fixture = TestBed.createComponent(CalendarModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
