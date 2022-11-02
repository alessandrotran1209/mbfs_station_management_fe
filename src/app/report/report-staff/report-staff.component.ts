import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { OperationApiService } from 'src/app/services/operation-api.service';
import { Operation } from 'src/app/utils/operation';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { ExportService } from 'src/app/services/export.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface PeriodicElement {
  position: number;
  code: string;
  work: string;
  date: string;
  status: number;
}

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-report-staff',
  templateUrl: './report-staff.component.html',
  styleUrls: ['./report-staff.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportStaffComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private apiService: ApiService,
    public operationApiService: OperationApiService,
    public datepipe: DatePipe,
    private exportService: ExportService
  ) {}
  total_completed_operation: 0;
  total_uncompleted_operation: 0;
  operation_list: any[] = [];
  panelOpenState = false;

  ngOnInit(): void {
    this.reactiveForm();
    var operation = new Operation();
    for (var i: number = 1; i < operation.getLength(); i++) {
      var option = operation.getOperation(String(i));
      this.operation_list.push({
        value: option.value,
        viewValue: option.viewValue,
      });
    }

    this.apiService.getStatistics().subscribe((response: any) => {
      this.total_completed_operation = response.data.total_completed_operation;
      this.total_uncompleted_operation =
        response.data.total_uncompleted_operation;
    });

    this.getServerData(null, false);
  }

  searchForm!: FormGroup;

  reactiveForm() {
    this.searchForm = this.fb.group({
      code: [''],
      month: [''],
      work_code: [''],
      status: [''],
    });
  }

  displayedColumns: string[] = [
    'position',
    'code',
    'work',
    'start_date',
    'end_date',
    'status',
  ];

  status_list: Food[] = [
    {
      value: '0',
      viewValue: 'Chưa hoàn thành',
    },
    {
      value: '1',
      viewValue: 'Hoàn thành',
    },
  ];

  clearForm(): void {
    this.reactiveForm();
    this.date = new FormControl(moment());
    this.getServerData(null, false);
  }

  onFormSubmit(): void {
    this.getServerData(null, true);
  }

  maxDate: Date = new Date();

  pageEvent: PageEvent;
  datasource: any = [];
  pageIndex: number;
  pageSize: number = 10;
  length: number;
  total: number;
  public getServerData(event?: PageEvent, isSearching?: boolean) {
    if (isSearching) {
      let page = 1;
      if (event != null) {
        page = event.pageIndex + 1;
      }

      const fromDate = this.date.value.add(1, 'M');
      var startOfMonth = `1/${fromDate.month()}/${fromDate.year()}`;

      const toDate = fromDate.add(1, 'M');
      var startOfNextMonth = `1/${toDate.month()}/${toDate.year()}`;

      this.date.setValue(this.date.value.subtract(2, 'M'));

      let code = this.searchForm.value.code;
      const work_code = this.searchForm.value.work_code;

      let status = this.searchForm.value.status;
      this.operationApiService
        .searchOperationList(
          code,
          startOfMonth,
          startOfNextMonth,
          work_code,
          status,
          page
        )
        .subscribe(
          (response: any) => {
            this.total = response.total;
            this.datasource = response.data;
            this.pageIndex = response.pageIndex;
            this.pageSize = response.pageSize;
            this.length = response.length;

            var operation = new Operation();
            for (var dat of response.data) {
              dat.operation_name = operation.getOperation(dat.work_code);
            }
          },
          (error) => {
            // handle error
          }
        );
    } else {
      let page = 1;
      if (event != null) {
        page = event.pageIndex + 1;
      }
      this.operationApiService.getOperationList(page).subscribe(
        (response: any) => {
          this.total = response.total;
          this.datasource = response.data;
          this.pageIndex = response.pageIndex;
          this.pageSize = response.pageSize;
          this.length = response.length;

          var operation = new Operation();
          for (var dat of response.data) {
            dat.operation_name = operation.getOperation(dat.work_code);
          }
        },
        (error) => {
          // handle error
        }
      );
    }
    return event;
  }

  date = new FormControl(moment());
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();

    this.searchForm.controls.month.setValue(this.date.value.format('MM/YYYY'));
  }

  export() {
    let filename = '';
    if (this.searchForm.controls.month.value == '') {
      const today = moment();
      filename = `${today.month() + 1}_${today.year()}`;
    } else {
      filename = this.searchForm.controls.month.value;
    }
    filename = 'BaoCao_' + filename;
    
    const fromDate = this.date.value.add(1, 'M');
    var startOfMonth = `1/${fromDate.month()}/${fromDate.year()}`;
    if(this.date.value.month() == 11){
      const month = 12
      var startOfNextMonth = `1/${month}/${this.date.value.year()}`;
    }
    else {
      var toDate = this.date.value.add(1, 'M');
      var startOfNextMonth = `1/${toDate.month()}/${toDate.year()}`;
    }    
    
    this.date.setValue(this.date.value.subtract(2, 'M'));
    this.searchForm.controls.month.setValue(this.date.value.format('MM/YYYY'));
    
    let code = this.searchForm.value.code;
    let work_code = this.searchForm.value.work_code;
    let status = this.searchForm.value.status;
    this.operationApiService
      .searchAllOperations(
        code,
        startOfMonth,
        startOfNextMonth,
        work_code,
        status
      )
      .subscribe(
        (response: any) => {
          let exportdatasource: any[] = [];
          const operation = new Operation();
          for (let response_data of response.data) {
            let status_str = 'Hoàn thành';
            if (response_data.status == '0') {
              status_str = 'Chưa hoàn thành';
            }
            const work_str = operation.getOperation(
              response_data.work_code
            ).viewValue;

            exportdatasource.push({
              STT: response_data.index,
              NVVH: response_data.operator,
              'Công việc': work_str,
              Trạm: response_data.station_code,
              'Trạng thái': status_str,
              'Thời gian bắt đầu': response_data.start_date,
              'Thời gian hoàn thành': response_data.end_date,
              'Ghi chú': response_data.note,
            });
          }

          this.exportService.exportExcel(exportdatasource, filename);
        },
        (error) => {
          // handle error
        }
      );
  }
}
