import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffAddComponent } from './dialog-staff-add.component';

describe('DialogStaffAddComponent', () => {
  let component: DialogStaffAddComponent;
  let fixture: ComponentFixture<DialogStaffAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStaffAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
