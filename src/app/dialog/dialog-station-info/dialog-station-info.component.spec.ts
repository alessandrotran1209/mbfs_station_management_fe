import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStationInfoComponent } from './dialog-station-info.component';

describe('DialogStationInfoComponent', () => {
  let component: DialogStationInfoComponent;
  let fixture: ComponentFixture<DialogStationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
