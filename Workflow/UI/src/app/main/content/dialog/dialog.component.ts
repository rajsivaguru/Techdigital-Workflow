import { Component, OnInit,ViewEncapsulation,AfterViewInit, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";
import { fuseAnimations } from '../../../core/animations';

@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {

  constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
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
            groupBy: data.groupByField,
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


@Component({
    selector: 'profilesearchreport-dialog',
    styleUrls: ['./dialog.component.scss'],
    templateUrl: 'dialog-profilesearchreportdetail.component.html'
})

export class DialogProfileSeachReportDetailComponent {
    dropdownSettings = {};
    constructor(
        public dialogRef: MatDialogRef<DialogDataComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dropdownSettings = {
            groupBy: data.groupByField,
            maxHeight: '350px',
            searchAutofocus: true,
            singleSelection: false,
            text: "",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: false,
            classes: 'custom_dropdown_tdw',
            badgeShowLimit: 2
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}


////@Component({
////    selector: 'externalconsultant-dialog',
////    ////templateUrl: '../visa/question/consultant.component.html',
////    templateUrl: 'dialog-user.component.html'
////})

////export class DialogConsultantComponent implements OnInit
////{
////    firstFormGroup: FormGroup;
////    secondFormGroup: FormGroup;

////    constructor(
////        private formBuilder: FormBuilder,
////        public dialogRef: MatDialogRef<DialogConsultantComponent>,
////        @Inject(MAT_DIALOG_DATA) public data: any) { }

////    ngOnInit() {
////        this.firstFormGroup = this.formBuilder.group({
////            firstCtrl: ['']
////        });
////        this.secondFormGroup = this.formBuilder.group({
////            secondCtrl: ['']
////        });
////    }

////    onNoClick(): void {
////        this.dialogRef.close();
////    }
////}

