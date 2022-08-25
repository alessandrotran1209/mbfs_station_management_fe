import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffUpdateComponent } from './dialog-staff-update.component';

describe('DialogStaffUpdateComponent', () => {
  let component: DialogStaffUpdateComponent;
  let fixture: ComponentFixture<DialogStaffUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStaffUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
