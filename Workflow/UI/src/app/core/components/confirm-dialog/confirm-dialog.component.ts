import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent implements OnInit
{
    public confirmMessage: string;
    public jobCode : string;
    public data : any;


    constructor(public dialogRef: MatDialogRef<FuseConfirmDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}
