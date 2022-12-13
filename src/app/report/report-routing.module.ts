import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchReportComponent } from './branch-report/branch-report.component';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import { ReportStaffComponent } from './report-staff/report-staff.component';

const routes: Routes = [
  { path: 'overview', component: ReportOverviewComponent },
  { path: 'overview/:id', component: BranchReportComponent },
  { path: 'operator', component: ReportStaffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
