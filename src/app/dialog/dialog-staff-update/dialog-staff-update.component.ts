import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { OperationApiService } from 'src/app/services/operation-api.service';
import { Operation } from 'src/app/utils/operation';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-staff-update',
  templateUrl: './dialog-staff-update.component.html',
  styleUrls: ['./dialog-staff-update.component.scss'],
})
export class DialogStaffUpdateComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogStaffUpdateComponent>,
    private _apiService: ApiService,
    private _operationApiService: OperationApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log(this.data);

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
        console.log(this.code);
      });

    this.selectedValue = this.data.operation_name.value;
    this.selectedCode = this.data.station_code;

    const [day, month, year] = this.data.start_date.split('/');

    this.selectedDate = new Date();
    this.selectedDate.setDate(Number(day));
    this.selectedDate.setMonth(Number(month - 1));
    this.selectedDate.setFullYear(Number(year));
  }
  searchCode: any;

  selectedValue: string;
  operation_list: any = [];
  station_list: any = [];
  code: Food[] = [];

  selectedCode: string;

  maxDate: Date = new Date();

  selectedDate: Date;

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  onKey() {
    this.code = [];
    for (var stationCode of this.station_list) {
      if (
        stationCode.viewValue
          .toLowerCase()
          .includes(this.searchCode.toLowerCase())
      ) {
        var option: Food = {
          value: stationCode.viewValue,
          viewValue: stationCode.viewValue,
        };
        this.code.push(option);
      }
    }
  }

  updateOperation() {
    var update_date = this.datepipe.transform(this.selectedDate, 'dd/MM/yyyy');
    if (
      update_date == this.data.date &&
      this.selectedCode == this.data.station_code &&
      this.selectedValue == this.data.work_code
    ) {
      this.onNoClick('');
      return;
    }
    var data = {
      operator: this.data.operator,
      station_code: this.selectedCode,
      date: update_date,
      work_code: this.selectedValue,
      old_station_code: this.data.station_code,
      old_date: this.data.date,
      old_work_code: this.data.work_code,
    };

    this._operationApiService.updateOperation(data).subscribe(
      (response: any) => {
        if (response == 200) {
          this.onNoClick('Updated');
        }
      },
      (error) => {}
    );
  }
}
