import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationComponent } from './station.component';
import { MaterialAllModules } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@NgModule({
  declarations: [StationComponent],
  imports: [CommonModule, MaterialAllModules, FormsModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class StationModule {}
