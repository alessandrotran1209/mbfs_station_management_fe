import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import 'rxjs/Rx';
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { DialogStaffAddComponent } from '../dialog/dialog-staff-add/dialog-staff-add.component';
import { DialogStaffInfoComponent } from '../dialog/dialog-staff-info/dialog-staff-info.component';
import { DialogStaffUpdateComponent } from '../dialog/dialog-staff-update/dialog-staff-update.component';
import { OperationApiService } from '../services/operation-api.service';
import { Operation } from '../utils/operation';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthService } from '../auth/auth.service';
import { DialogGroupLeadAddComponent } from '../dialog/dialog-group-lead-add/dialog-group-lead-add.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public operationApiService: OperationApiService,
    public datepipe: DatePipe,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reactiveForm();

    this.getServerData(null, false);
  }
  searchForm!: FormGroup;
  reactiveForm() {
    this.searchForm = this.fb.group({
      code: [''],
      fromDate: [''],
      toDate: [''],
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
    'operation',
  ];
  dialog_width = window.innerHeight;
  openAddDialog(): void {
    const role = this.authService.getDecodedToken().role
    
    if(role == 'operator'){
      const dialogRef = this.dialog.open(DialogStaffAddComponent, {
        width: window.innerWidth * 0.8 + 'px',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Added') {
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: 'Thêm mới thành công',
            duration: 2000,
            panelClass: ['snack-notification'],
          });
        }
        this.getServerData(null, false);
      });
    }
    if(role == 'group leader'){
      const dialogRef = this.dialog.open(DialogGroupLeadAddComponent, {
        width: window.innerWidth * 0.8 + 'px',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Added') {
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: 'Thêm mới thành công',
            duration: 2000,
            panelClass: ['snack-notification'],
          });
        }
        this.getServerData(null, false);
      });
    }
    
  }

  openUpdateDialog(element: any): void {
    if (element.status == 1) {
      return;
    }
    const dialogRef = this.dialog.open(DialogStaffUpdateComponent, {
      width: window.innerWidth * 0.8 + 'px',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Updated') {
        this._snackBar.openFromComponent(PizzaPartyComponent, {
          data: 'Cập nhật thành công',
          duration: 2000,
          panelClass: ['snack-notification'],
        });
      }
      this.getServerData(null, false);
    });
  }

  openInfoDialog(element: any): void {
    const dialogRef = this.dialog.open(DialogStaffInfoComponent, {
      data: element,
    });
  }

  completeTask(element: any) {
    if (element.status == 1) {
      return;
    }
    var data = {
      station_code: element.station_code,
      date: moment(element.start_date, 'DD/MM/YYYY HH:mm:ss').format("YYYY-MM-DDTHH:mm:ss"),
      work_code: element.operation_name.value,
    };

    this.operationApiService.completeOperation(data).subscribe(
      (response: any) => {
        if (response == 200) {
          this.getServerData(null, false);
          this._snackBar.openFromComponent(PizzaPartyComponent, {
            data: 'Hoàn thành công việc',
            duration: 2000,
            panelClass: ['snack-notification'],
          });
        }
      },
      (error) => {}
    );
  }

  districts: any[] = [];

  clearForm(): void {
    this.reactiveForm();
    this.getServerData(null, false);
  }

  onFormSubmit(): void {
    this.isSearching = true;
    this.getServerData(null, true);
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

          // this.datasource.start_date_dateonly = this.datasource.start_date.split()[0]
          // this.datasource.end_date_dateonly = this.datasource.end_date.split()[0]

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

  public getDateOnly(fullTimestamp: string) {   
    if(fullTimestamp == undefined){
      return fullTimestamp;
    }
    return fullTimestamp.split(' ')[0];
  }

  status_list = [
    { value: 0, viewValue: 'Chưa hoàn thành' },
    { value: 1, viewValue: 'Hoàn thành' },
  ];
}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [
    `
      .snack-notification {
        background-color: #1bcba1;
      }
    `,
  ],
})
export class PizzaPartyComponent {
  constructor(
    public sbRef: MatSnackBarRef<PizzaPartyComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
