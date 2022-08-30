import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { OperationApiService } from 'src/app/services/operation-api.service';
import { Operation } from 'src/app/utils/operation';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
          this.station_list.push(resp.station_code);
        }

        this.filteredOptions =
          this.insertForm.controls.station_code.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
      });
  }
  operation_list: any[] = [];
  station_list: string[] = [];
  insertForm!: FormGroup;
  maxDate: Date = new Date();

  reactiveForm() {
    this.insertForm = this.fb.group({
      station_code: this.fb.control('', [Validators.required]),
      date: this.fb.control('', [Validators.required]),
      work_code: this.fb.control('', [Validators.required]),
      note: [''],
    });
  }

  onNoClick(message: string): void {
    this.dialogRef.close(message);
  }

  onFormSubmit() {
    if (this.insertForm.valid) {
      var day = moment(this.insertForm.value.date).format('YYYY-MM-DD');
      var time = moment().format('HH:mm:ss');

      this.insertForm.addControl('lat', new FormControl(this.lat));
      this.insertForm.addControl('lng', new FormControl(this.lng));

      var operation_data = this.insertForm.value;
      operation_data.date = day + 'T' + time;
      this._operationApiService.insertOperation(operation_data).subscribe(
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
  filteredOptions: Observable<string[]>;
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.station_list.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
