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

@Component({
    selector   : 'jobs-load-dialog',
    styleUrls    : ['./dialog.component.scss'],
    templateUrl: 'dialog-user.component.html'
})

export class DialogDataComponent
{
    dropdownSettings = {};
    constructor(
      public dialogRef: MatDialogRef<DialogDataComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
      )
    {
      this.dropdownSettings =  { 
            groupBy :"roleName",
            maxHeight : '350px',
            searchAutofocus : true,
            singleSelection: false, 
            text:"",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll : false,
            classes : 'custom_dropdown_tdw',
            badgeShowLimit: 2
        };
    }

    onNoClick(): void
    {
        this.dialogRef.close();
    }
}

