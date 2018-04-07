import { Component, OnInit,ViewEncapsulation,AfterViewInit, Input, Output, Inject } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Router } from "@angular/router";



@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {

  constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    //console.log('closed')
    this.dialogRef.close();
  }

}