import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationComponent } from 'src/app/station/station.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportOverviewComponent } from './report/report-overview/report-overview.component';
import { ReportStaffComponent } from './report/report-staff/report-staff.component';
import { StaffComponent } from './staff/staff.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'station', component: StationComponent },
  { path: 'work', component: StaffComponent },
  { path: 'report-staff', component: ReportStaffComponent },
  { path: 'report-overview', component: ReportOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
