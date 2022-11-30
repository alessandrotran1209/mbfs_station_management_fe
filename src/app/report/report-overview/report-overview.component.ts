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

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ExportService } from 'src/app/services/export.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DAY_MONTH_YEAR } from 'src/app/utils/dateformat';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.component.html',
  styleUrls: ['./report-overview.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DAY_MONTH_YEAR },
  ],
})
export class ReportOverviewComponent implements OnInit {
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
  station_list: any[] = [];
  province_set = new Set<string>();
  district_set = new Set<any>();
  district_list: string[] = [];
  filteredOptions: Observable<any[]>;
  provincefilteredOptions: Observable<any[]>;
  districtfilteredOptions: Observable<any[]>;

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

    this.prefetchData();

    this.getServerData(null);
  }

  searchForm!: FormGroup;
  range!: FormGroup;
  isSearching = false;

  reactiveForm() {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    this.searchForm = this.fb.group({
      code: [''],
      work_code: [''],
      province: [''],
      district: [''],
      status: [''],
    });
  }

  displayedColumns: string[] = [
    'position',
    'code',
    'operator',
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
    this.reactiveForm();
    this.isSearching = false;
    this.prefetchData();
    this.getServerData(null);
  }

  onFormSubmit(): void {
    this.isSearching = true;
    this.getServerData(null);
  }

  maxDate: Date = new Date();

  pageEvent: PageEvent;
  datasource: any = [];
  pageIndex: number;
  pageSize: number = 10;
  length: number;
  total: number;

  public getServerData(event?: PageEvent) {
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
      const province = this.searchForm.value.province;
      const district = this.searchForm.value.district;
      this.operationApiService
        .searchOperationList(
          code,
          fromDate,
          toDate,
          work_code,
          status,
          page,
          province,
          district
        )
        .subscribe(
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
            try {
              let status_str = 'Hoàn thành';
              if (response_data.status == '0') {
                status_str = 'Chưa hoàn thành';
              }

              if (
                operation.getOperation(response_data.work_code) == undefined
              ) {
                throw new Error(response_data);
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
            } catch (e) {
              const result = (e as Error).message;
              if (typeof e === 'string') {
                console.log(e.toUpperCase());
              } else if (e instanceof Error) {
                console.log(e.message);
              }
            }
          }

          this.exportService.exportExcel(exportdatasource, filename);
        },
        (error) => {
          // handle error
        }
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.station_list.filter((option) =>
      option.station_code.toLowerCase().includes(filterValue)
    );
  }

  private _provincefilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return [...this.province_set].filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _districtfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.district_list.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  updateDistricts(event: any) {
    this.district_list = [];
    [...this.district_set].filter((value) => {
      if (
        !this.district_list.includes(value.district) &&
        value.province == event.option.value
      ) {
        this.district_list.push(value.district);
      }
    });
  }

  prefetchData() {
    this.apiService.prefetchSearchData().subscribe((response: any) => {
      for (var resp of response.data) {
        this.station_list.push(resp);
        this.province_set.add(resp.province);
        this.district_set.add({
          province: resp.province,
          district: resp.district,
        });
      }
      this.filteredOptions = this.searchForm.controls.code.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );

      this.provincefilteredOptions =
        this.searchForm.controls.province.valueChanges.pipe(
          startWith(''),
          map((value) => this._provincefilter(value || ''))
        );

      this.districtfilteredOptions =
        this.searchForm.controls.district.valueChanges.pipe(
          startWith(''),
          map((value) => this._districtfilter(value || ''))
        );
    });
  }
}
