import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { OperationApiService } from 'src/app/services/operation-api.service';
import { Operation } from 'src/app/utils/operation';

@Component({
  selector: 'app-dialog-staff-add',
  templateUrl: './dialog-staff-add.component.html',
  styleUrls: ['./dialog-staff-add.component.scss'],
})
export class DialogStaffAddComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogStaffAddComponent>,
    private _apiService: ApiService,
    private _operationApiService: OperationApiService,
    public fb: FormBuilder,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.reactiveForm();

    var operation = new Operation();
    for (var i: number = 1; i < operation.getLength(); i++) {
      var option = operation.getOperation(String(i));
      this.operation_list.push({
        value: option.value,
        viewValue: option.viewValue,
      });
    }

    this._operationApiService
      .getOpeartorStation()
      .subscribe((response: any) => {
        for (var resp of response.data) {
          this.station_list.push({
            value: resp.station_code,
            viewValue: resp.station_code,
          });
        }
        this.code = this.station_list;
      });
  }
  operation_list: any[] = [];
  station_list: any[] = [];
  code: any[] = [];
  insertForm!: FormGroup;
  maxDate: Date = new Date();

  reactiveForm() {
    this.insertForm = this.fb.group({
      station_code: [''],
      date: [''],
      work_code: [''],
      search_code: [''],
      note: [''],
    });
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  onFormSubmit() {
    this.insertForm.setControl(
      'date',
      new FormControl(
        this.datepipe.transform(this.insertForm.value.date, 'dd/MM/yyyy')
      )
    );
    this.insertForm.addControl('lat', new FormControl(this.lat));
    this.insertForm.addControl('lng', new FormControl(this.lng));
    this._operationApiService.insertOperation(this.insertForm.value).subscribe(
      (response: any) => {
        if (response == 200) {
          this.onNoClick('Added');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onKey() {
    this.code = [];
    for (var stationCode of this.station_list) {
      if (
        stationCode.viewValue
          .toLowerCase()
          .includes(this.insertForm.value.search_code.toLowerCase())
      ) {
        var option = {
          value: stationCode.viewValue,
          viewValue: stationCode.viewValue,
        };
        this.code.push(option);
      }
    }
  }
  public lat: any;
  public lng: any;
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
