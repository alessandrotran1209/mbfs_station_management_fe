import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportOverviewComponent } from './report-overview/report-overview.component';
import { ReportStaffComponent } from './report-staff/report-staff.component';

const routes: Routes = [
  { path: 'overview', component: ReportOverviewComponent },
  { path: 'operator', component: ReportStaffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
