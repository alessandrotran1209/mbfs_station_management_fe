import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { OperationApiService } from 'src/app/services/operation-api.service';
import { Operation } from 'src/app/utils/operation';
import { ExportService } from 'src/app/services/export.service';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

import { DAY_MONTH_YEAR } from 'src/app/utils/dateformat';

@Component({
  selector: 'app-report-staff',
  templateUrl: './report-staff.component.html',
  styleUrls: ['./report-staff.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DAY_MONTH_YEAR },
  ],
})
export class ReportStaffComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private apiService: ApiService,
    public operationApiService: OperationApiService,
    private exportService: ExportService
  ) {}
  total_completed_operation: 0;
  total_uncompleted_operation: 0;
  operation_list: any[] = [];
  panelOpenState = false;
  range!: FormGroup;
  searchForm!: FormGroup;
  isSearching = false;

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

  reactiveForm() {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    this.searchForm = this.fb.group({
      code: [''],
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

  status_list: any[] = [
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
    this.isSearching = false;
    this.reactiveForm();
    this.getServerData(null);
  }

  onFormSubmit(): void {
    this.isSearching = true;
    this.getServerData(null);
  }

  pageEvent: PageEvent;
  datasource: any = [];
  pageIndex: number;
  pageSize: number = 10;
  length: number;
  total: number;

  public getServerData(event?: PageEvent, isSearching?: boolean) {
    if (this.isSearching) {
      let page = 1;
      if (event != null) {
        page = event.pageIndex + 1;
      }

      let fromDate = moment(this.range.controls['start'].value).format(
        'DD/MM/YYYY'
      );
      let toDate = moment(this.range.controls['end'].value).format(
        'DD/MM/YYYY'
      );
      if (fromDate == 'Invalid date') fromDate = '';
      if (toDate == 'Invalid date') toDate = '';
      let code = this.searchForm.value.code;
      const work_code = this.searchForm.value.work_code;

      let status = this.searchForm.value.status;
      this.operationApiService
        .searchOperationList(
          code,
          fromDate,
          toDate,
          work_code,
          status,
          page,
          '',
          ''
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
          this.pageIndex = page - 1;
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

  export() {
    let filename = 'BaoCao_';

    var fromDate = moment(this.range.controls['start'].value).format(
      'DD/MM/YYYY'
    );
    var toDate = moment(this.range.controls['end'].value).format('DD/MM/YYYY');
    filename += `${fromDate}_${toDate}`;

    if (fromDate == 'Invalid date') fromDate = '';
    if (toDate == 'Invalid date') toDate = '';
    if (fromDate == '' && toDate == '') {
      filename = 'BaoCao_All';
    }

    let code = this.searchForm.value.code;
    let work_code = this.searchForm.value.work_code;
    let status = this.searchForm.value.status;
    const province = this.searchForm.value.province;
    const district = this.searchForm.value.district;
    this.operationApiService
      .searchAllOperations(
        code,
        fromDate,
        toDate,
        work_code,
        status,
        province,
        district
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
              'Tên NVVH': response_data.operator_fullname,
              Tổ: response_data.group,
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
