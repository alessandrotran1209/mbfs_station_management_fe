import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        console.log(response);

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
    this.insertForm.value.date = this.datepipe.transform(
      this.insertForm.value.date,
      'dd/MM/yyyy'
    );
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
}
