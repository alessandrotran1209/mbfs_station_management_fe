import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MaterialAllModules } from 'src/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePwComponent } from './change-pw/change-pw.component';

@NgModule({
  declarations: [LoginComponent, ChangePwComponent],
  imports: [CommonModule, MaterialAllModules, FormsModule, ReactiveFormsModule],
})
export class LoginModule {}
