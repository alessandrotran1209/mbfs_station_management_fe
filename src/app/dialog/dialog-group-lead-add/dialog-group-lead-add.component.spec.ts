import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGroupLeadAddComponent } from './dialog-group-lead-add.component';

describe('DialogGroupLeadAddComponent', () => {
  let component: DialogGroupLeadAddComponent;
  let fixture: ComponentFixture<DialogGroupLeadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGroupLeadAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGroupLeadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
