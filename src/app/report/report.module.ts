import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialAllModules } from 'src/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportStaffComponent } from './report-staff/report-staff.component';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import { ReportRoutingModule } from './report-routing.module';
import { BranchReportComponent } from './branch-report/branch-report.component';

@NgModule({
  declarations: [ReportStaffComponent, ReportOverviewComponent, BranchReportComponent],
  imports: [CommonModule, ReportRoutingModule, MaterialAllModules, FormsModule, ReactiveFormsModule],
})
export class ReportModule {}
