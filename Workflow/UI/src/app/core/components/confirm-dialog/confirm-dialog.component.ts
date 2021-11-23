import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent implements OnInit
{
    public title: string;
    public confirmMessage: string;
    public jobCode : string;
    public data: any;
    public showCancelButton: boolean = true;
    public actionButtonText: string = 'Continue';
    
    constructor(public dialogRef: MatDialogRef<FuseConfirmDialogComponent>)
    {
    }

    ngOnInit()
    {
    }
}
