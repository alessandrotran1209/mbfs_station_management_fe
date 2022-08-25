import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffInfoComponent } from './dialog-staff-info.component';

describe('DialogStaffInfoComponent', () => {
  let component: DialogStaffInfoComponent;
  let fixture: ComponentFixture<DialogStaffInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStaffInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
