import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-staff-info',
  templateUrl: './dialog-staff-info.component.html',
  styleUrls: ['./dialog-staff-info.component.scss'],
})
export class DialogStaffInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogStaffInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
