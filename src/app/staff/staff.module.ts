import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import { MaterialAllModules } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PizzaPartyComponent } from './staff.component';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [StaffComponent, PizzaPartyComponent],
  imports: [CommonModule, MaterialAllModules, FormsModule, ReactiveFormsModule],
  providers: [DatePipe],
})
export class StaffModule {}
