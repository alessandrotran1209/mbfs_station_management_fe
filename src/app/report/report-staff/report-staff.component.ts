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
    public datepipe: DatePipe
  ) {}
  total_completed_operation: 0;
  total_uncompleted_operation: 0;
  ngOnInit(): void {
    this.reactiveForm();

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
      province: [''],
      district: [''],
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

  foods: Food[] = [
    {
      value: 'Xử lý lỗi thiết bị Tủ 2G, 3G và 4G',
      viewValue: 'Xử lý lỗi thiết bị Tủ 2G, 3G và 4G',
    },
    {
      value:
        'Xử lý lỗi  RRU, lỗi dây quang, lỗi Feeder, Jumper và anten 2G, 3G, 4G',
      viewValue:
        'Xử lý lỗi  RRU, lỗi dây quang, lỗi Feeder, Jumper và anten 2G, 3G, 4G',
    },
    {
      value: 'Xử lý lỗi thiết bị truyền dẫn Viba',
      viewValue: 'Xử lý lỗi thiết bị truyền dẫn Viba',
    },
    {
      value:
        'Xử lý lỗi thiết bị truyền dẫn Quang trong trạm: dây nhảy, CSG, ODF, Modul quang…',
      viewValue:
        'Xử lý lỗi thiết bị truyền dẫn Quang trong trạm: dây nhảy, CSG, ODF, Modul quang…',
    },
    {
      value: 'Xử lý lỗi các thiết bị phụ trợ: Cảnh báo ngoài, tủ nguồn,…',
      viewValue: 'Xử lý lỗi các thiết bị phụ trợ: Cảnh báo ngoài, tủ nguồn,…',
    },
    {
      value: 'Thực hiện nâng-hạ cấp cấu hình thiết bị theo yêu cầu của MBF',
      viewValue: 'Thực hiện nâng-hạ cấp cấu hình thiết bị theo yêu cầu của MBF',
    },
    {
      value:
        'Đo kiểm xác định điểm đứt cáp quang, triển khai kéo cáp, hàn nối măng xông và treo măng xông',
      viewValue:
        'Đo kiểm xác định điểm đứt cáp quang, triển khai kéo cáp, hàn nối măng xông và treo măng xông',
    },
    {
      value: 'Đo kiểm và hiệu chỉnh trống Viba',
      viewValue: 'Đo kiểm và hiệu chỉnh trống Viba',
    },
    {
      value: 'Kiểm tra, thay thế dây IF viba',
      viewValue: 'Kiểm tra, thay thế dây IF viba',
    },
    {
      value: 'Đo kiểm, xử lý suy hao cáp..',
      viewValue: 'Đo kiểm, xử lý suy hao cáp..',
    },
    {
      value: 'Triển khai chạy máy phát điện di động',
      viewValue: 'Triển khai chạy máy phát điện di động',
    },
    {
      value: 'Triển khai chạy máy phát điện cố định',
      viewValue: 'Triển khai chạy máy phát điện cố định',
    },
    {
      value: 'Vệ sinh công nghiệp nhà trạm',
      viewValue: 'Vệ sinh công nghiệp nhà trạm',
    },
    {
      value: 'Tiếp nhận, liên hệ khách hàng theo thông tin PA',
      viewValue: 'Tiếp nhận, liên hệ khách hàng theo thông tin PA',
    },
    {
      value: 'Đến hiện trường đo kiểm và phối hợp xác định nguyên nhân',
      viewValue: 'Đến hiện trường đo kiểm và phối hợp xác định nguyên nhân',
    },
    {
      value:
        'Phối hợp hiệu chỉnh anten, lắp đặt và điều chuyển Smallcell, Repeater',
      viewValue:
        'Phối hợp hiệu chỉnh anten, lắp đặt và điều chuyển Smallcell, Repeater',
    },
    {
      value: 'Kiểm tra, cập nhật tuyến cáp định kì',
      viewValue: 'Kiểm tra, cập nhật tuyến cáp định kì',
    },
    {
      value: 'Bảo dưỡng, căng chùng tuyến cáp nguy cơ mất an toàn..',
      viewValue: 'Bảo dưỡng, căng chùng tuyến cáp nguy cơ mất an toàn..',
    },
    {
      value:
        'Phối hợp các bên Điện lực, chiếu sáng, quản lý đô thị để thực hiện các công việc liên quan đến cáp trên cột, trong cống bể…',
      viewValue:
        'Phối hợp các bên Điện lực, chiếu sáng, quản lý đô thị để thực hiện các công việc liên quan đến cáp trên cột, trong cống bể…',
    },
    {
      value:
        'Hỗ trợ các đối  tác ra vào trạm, giám sát công việc tại trạm: bảo dưỡng, lắp đặt, thay thế thiết bị, hạ tầng nhà trạm..',
      viewValue:
        'Hỗ trợ các đối  tác ra vào trạm, giám sát công việc tại trạm: bảo dưỡng, lắp đặt, thay thế thiết bị, hạ tầng nhà trạm..',
    },
    {
      value: 'Phối hợp giám sát tuyến cáp Quang',
      viewValue: 'Phối hợp giám sát tuyến cáp Quang',
    },
    {
      value: 'Tiếp nhận và đóng ticket sự cố trạm quản lý',
      viewValue: 'Tiếp nhận và đóng ticket sự cố trạm quản lý',
    },
    {
      value: 'Hồ sơ thanh toán tiền điện, thuê nhà trạm',
      viewValue: 'Hồ sơ thanh toán tiền điện, thuê nhà trạm',
    },
    {
      value: 'Công việc khác ….',
      viewValue: 'Công việc khác ….',
    },
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

  districts_list: any[] = [
    {
      province: 'HN',
      districts: [
        { value: 'BD', viewValue: 'Ba Đình' },
        { value: 'CG', viewValue: 'Cầu Giấy' },
      ],
    },
    {
      province: 'TB',
      districts: [
        { value: 'DH', viewValue: 'Đông Hưng' },
        { value: 'HH', viewValue: 'Hưng Hà' },
      ],
    },
  ];

  districts: any[] = [];

  updateProvince(event: any): void {
    for (var d of this.districts_list) {
      if (d.province == event) {
        this.districts = d.districts;
        break;
      }
    }
  }

  clearForm(): void {
    this.searchForm.reset();
  }

  onFormSubmit(): void {
    console.log(this.searchForm.value);
  }

  maxDate: Date = new Date();

  pageEvent: PageEvent;
  datasource: any = [];
  pageIndex: number;
  pageSize: number = 10;
  length: number;
  total: number;
  isSearching: boolean = false;
  public getServerData(event?: PageEvent, isSearching?: boolean) {
    if (isSearching) {
      let page = 1;
      if (event != null) {
        page = event.pageIndex + 1;
      }
      var fromDate = this.datepipe.transform(
        this.searchForm.value.fromDate,
        'dd/MM/yyyy'
      );
      var toDate = this.datepipe.transform(
        this.searchForm.value.toDate,
        'dd/MM/yyyy'
      );

      let code = this.searchForm.value.code;
      let status = this.searchForm.value.status;
      this.operationApiService
        .searchOperationList(code, fromDate, toDate, status, page)
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
    console.log(this.searchForm.value);
  }
}
