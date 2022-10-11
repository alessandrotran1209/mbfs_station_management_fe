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

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    public apiService: ApiService
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
}
