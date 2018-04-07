import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JobsService } from './jobs.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { JobsFormComponent } from './jobs-form/jobs-form.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Login2Service } from '../login/login-2.service';

@Component({
    selector     : 'fuse-contacts',
    templateUrl  : './jobs.component.html',
    styleUrls    : ['./jobs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class JobsComponent implements OnInit
{
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    dialogRef: any;

    constructor(
        private jobsService: JobsService,
        public dialog: MatDialog,
        public router : Router,
        private loginService : Login2Service
    )
    {

       
        this.searchInput = new FormControl('');
    }

    newJob()
    {
        this.jobsService.action =  'new';
        this.router.navigateByUrl('/jobsform');

        // this.dialogRef = this.dialog.open(JobsFormComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data      : {
        //         action: 'new'
        //     }
        // });

        // this.dialogRef.afterClosed()
        //     .subscribe((response: FormGroup) => {
        //         if ( !response )
        //         {
        //             return;
        //         }

        //         this.jobsService.updateContact(response.getRawValue());

        //     });

    }

    ngOnInit()
    {

        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }

        this.jobsService.onSelectedContactsChanged
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .debounceTime(300)
            //.distinctUntilChanged()
            .subscribe(searchText => {
                this.jobsService.onSearchTextChanged.next(searchText);
            });
    }

}
