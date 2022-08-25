import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-station-info',
  templateUrl: './dialog-station-info.component.html',
  styleUrls: ['./dialog-station-info.component.scss'],
})
export class DialogStationInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogStationInfoComponent>,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const iframe = document.getElementById('embeddedPage') as HTMLIFrameElement;
    iframe.contentWindow.location.replace(this.unsanitizedUrl);
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.unsanitizedUrl
    );
  }

  unsanitizedUrl = `//maps.google.com/maps?q=${this.data.lat},${this.data.long}&z=14&output=embed`;
  mapUrl: SafeResourceUrl;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
