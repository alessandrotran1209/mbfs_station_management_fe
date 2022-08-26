import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  position: number;
  code: string;
  work: string;
  date: string;
  status: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    code: 'TB_DHG_BACH_DANG',
    work: 'Xử lý lỗi thiết bị Tủ 2G, 3G và 4G',
    date: '22/07/2022',
    status: 1,
  },
  {
    position: 2,
    code: 'TB_DHG_BACH_DANG',
    work: 'Xử lý lỗi  RRU, lỗi dây quang, lỗi Feeder, Jumper và anten 2G, 3G, 4G',
    date: '22/07/2022',
    status: 0,
  },
  {
    position: 3,
    code: 'TB_DHG_BACH_DANG',
    work: 'Phối hợp các bên Điện lực, chiếu sáng, quản lý đô thị để thực hiện các công việc liên quan đến cáp trên cột, trong cống bể…',
    date: '22/07/2022',
    status: 1,
  },
];

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-report-overview',
  templateUrl: './report-overview.component.html',
  styleUrls: ['./report-overview.component.scss'],
})
export class ReportOverviewComponent implements OnInit {
  constructor(public dialog: MatDialog, public fb: FormBuilder) {}

  ngOnInit(): void {
    this.reactiveForm();
  }

  searchForm!: FormGroup;

  reactiveForm() {
    this.searchForm = this.fb.group({
      code: [''],
      work: [''],
      status: [''],
      province: [''],
      district: [''],
    });
  }

  displayedColumns: string[] = ['position', 'code', 'work', 'date', 'status'];
  dataSource = ELEMENT_DATA;

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
  province_list: Food[] = [
    { value: 'HN', viewValue: 'Hà Nội' },
    { value: 'TB', viewValue: 'Thái Bình' },
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

  onFormSubmit(): void {}

  maxDate: Date = new Date();
}
