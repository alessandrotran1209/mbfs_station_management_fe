import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StationModule } from './station/station.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from './dialog/dialog.module';
import { StaffModule } from './staff/staff.module';
import { ReportModule } from './report/report.module';
import { HomeComponent } from './home/home.component';
import { MaterialAllModules } from 'src/material.module';

import { FusionChartsModule } from 'angular-fusioncharts';

import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { LoginModule } from './login/login.module';
import { JWTInterceptorInterceptor } from './auth/jwtinterceptor.interceptor';
import { LayoutModule } from '@angular/cdk/layout';

FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    StationModule,
    MatSidenavModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    StaffModule,
    ReportModule,
    MaterialAllModules,
    FusionChartsModule,
    LoginModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
