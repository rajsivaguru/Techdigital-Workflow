import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector     : 'fuse-mail-compose',
    templateUrl  : './compose.component.html',
    styleUrls    : ['./compose.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotificationComposeFormComponent implements OnInit
{
    composeForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<NotificationComposeFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    )
    {
        this.composeForm = this.createComposeForm();
    }

    ngOnInit()
    {
    }

    createComposeForm()
    {
        return new FormGroup({
            from   : new FormControl({
                value   : 'johndoe@creapond.com',
                disabled: true
            }),
            to     : new FormControl(''),
            cc     : new FormControl(''),
            bcc    : new FormControl(''),
            subject: new FormControl(''),
            message: new FormControl('')
        });
    }

}
