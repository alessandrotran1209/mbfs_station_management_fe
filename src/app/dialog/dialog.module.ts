import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogStationInfoComponent } from './dialog-station-info/dialog-station-info.component';

import { MaterialAllModules } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogStaffAddComponent } from './dialog-staff-add/dialog-staff-add.component';
import { DialogStaffUpdateComponent } from './dialog-staff-update/dialog-staff-update.component';
import { DialogStaffInfoComponent } from './dialog-staff-info/dialog-staff-info.component';

@NgModule({
  declarations: [
    DialogStationInfoComponent,
    DialogStaffAddComponent,
    DialogStaffUpdateComponent,
    DialogStaffInfoComponent,
  ],
  imports: [CommonModule, MaterialAllModules, FormsModule, ReactiveFormsModule],
})
export class DialogModule {}
