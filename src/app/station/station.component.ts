import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import 'rxjs/Rx';
import { DialogStationInfoComponent } from '../dialog/dialog-station-info/dialog-station-info.component';
import { ApiService } from '../services/api.service';
import { Districts } from 'src/app/utils/districts';
import { AuthService } from '../auth/auth.service';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PizzaPartyComponent } from '../staff/staff.component';
import { Response } from '@angular/http';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reactiveForm();

    this.apiService.getStationCodeList().subscribe((res: any) => {
      this.districts = res.data;
    });
    this.getServerData(null);
  }
  searchForm!: FormGroup;
  reactiveForm() {
    this.searchForm = this.fb.group({
      code: [''],
      province: [''],
      district: [''],
    });
  }

  displayedColumns: string[] = [
    'position',
    'code',
    // 'province',
    // 'manager',
    // 'phone',
    // 'operation',
  ];

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(DialogStationInfoComponent, {
      // width: window.innerWidth * (772 / 1920) + 'px',
      // height: window.innerHeight * (539 / 1080) + 'px',
      data: data,
    });
  }

  foods: any[] = [];
  districts: any[] = [];

  clearForm(): void {
    this.isSearching = false;
    this.getServerData(null, false);

    this.searchForm.controls['code'].setValue('');
    this.searchForm.controls['district'].setValue('');
  }

  onFormSubmit(): void {
    this.isSearching = true;
    this.getServerData(null, this.isSearching);
  }

  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number;
  pageSize: number = 10;
  length: number;
  total: number;
  isSearching: boolean = false;

  public getServerData(event?: PageEvent, isSearching?: boolean) {
    if (this.isSearching) {
      let page = 1;
      if (event != null) {
        page = event.pageIndex + 1;
      }
      let code = this.searchForm.value.code;
      let province = this.searchForm.value.province;
      let district = this.searchForm.value.district;
      this.apiService.searchStation(code, province, district, page).subscribe(
        (response: any) => {
          this.total = response.total;
          this.datasource = response.data;
          this.pageIndex = response.pageIndex;
          this.pageSize = response.pageSize;
          this.length = response.length;

          this.searchForm.controls['province'].setValue(
            response.data[0].province
          );
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
      this.apiService.getStationList(page).subscribe(
        (response: any) => {
          this.total = response.total;
          this.datasource = response.data;
          this.pageIndex = response.pageIndex;
          this.pageSize = response.pageSize;
          this.length = response.length;

          this.searchForm.controls['province'].setValue(
            response.data[0].province
          );
        },
        (error) => {
          // handle error
        }
      );
    }
    return event;
  }

  isAdminOnly() {
    return this.authService.getDecodedToken().role == 'admin';
  }

  fileName = '';

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
    }

    let workBook: XLSX.WorkBook = null;
    let jsonData = null;
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      // const ws: XLSX.WorkSheet = workBook.Sheets[target];
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        return XLSX.utils.sheet_to_json(sheet);
      }, {});

      let stations_data = [];

      for (let data of jsonData as []) {
        try {
          const insert_data = {
            station_code: this._getValueWithVietnameseKey(
              data,
              'T??n tr???m/m?? tuy???n c??p'
            ),
            group: this._getValueWithVietnameseKey(data, 'T???'),
            region: this._getValueWithVietnameseKey(data, '????i'),
            zone: this._getValueWithVietnameseKey(data, 'TT M???ng l?????i'),
            branch: this._getValueWithVietnameseKey(data, "MFS's Branch"),
            type: this._getValueWithVietnameseKey(data, 'Type'),
            address: this._getValueWithVietnameseKey(data, '?????a ch???'),
            lat: this._getValueWithVietnameseKey(data, 'V?? ?????'),
            long: this._getValueWithVietnameseKey(data, 'Kinh ?????'),
            district: this._getValueWithVietnameseKey(data, 'Qu???n/Huy???n'),
            province: this._getValueWithVietnameseKey(data, 'T???nh'),
            operator: this._getValueWithVietnameseKey(
              data,
              'Nh??n vi??n v???n h??nh'
            ),
            group_leader: this._getValueWithVietnameseKey(data, 'T??? tr?????ng'),
            phone_number: this._getValueWithVietnameseKey(
              data,
              'S??? ??i???n tho???i'
            ),
          };
          stations_data.push(insert_data);
          console.log(insert_data);
        } catch (e) {
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: 'File sai format',
            duration: 2000,
            panelClass: ['snack-failed'],
          });
        }
      }

      this.apiService.insertUpdateStations(stations_data).subscribe(
        (response) => {
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: 'Th??m m???i/s???a ?????i th??nh c??ng',
            duration: 2000,
            panelClass: ['snack-notification'],
          });
        },
        (error) => {
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: '???? c?? l???i x???y ra',
            duration: 2000,
            panelClass: ['snack-failed'],
          });
        }
      );
    };

    reader.readAsBinaryString(file);
  }

  private _getValueWithVietnameseKey(obj: any, key: string) {
    if (obj[key] === undefined) {
      console.log(key);

      throw new Error('invalid key');
    }
    return obj[key] as string;
  }
}
