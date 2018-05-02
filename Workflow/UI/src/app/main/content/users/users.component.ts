import { Component, OnInit,ViewEncapsulation,AfterViewInit, Input, Output, Inject } from '@angular/core';
import { UsersService } from './users.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersFormComponent } from './users-form/users-form.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Router } from "@angular/router";
import { LoginService } from '../login/login.service';

@Component({
    selector     : 'fuse-contacts',
    templateUrl  : './users.component.html',
    styleUrls    : ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UsersComponent implements OnInit
{
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    dialogRef: any;

    constructor(
        private contactsService: UsersService,
        public dialog: MatDialog,
        private router : Router,
        private loginService : LoginService
    )
    {



        this.searchInput = new FormControl('');
    }

    ngOnInit()
    {

        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }

        this.contactsService.onSelectedContactsChanged
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .debounceTime(300)
            //.distinctUntilChanged()
            .subscribe(searchText => {
                
                this.contactsService.onSearchTextChanged.next(searchText);
            });
        

       
    }
     exportToExcel(event) {
        this.contactsService.exportUser().then(response => {
        });
    }
    newContact()
    {
        this.contactsService.action =  'new';
        this.router.navigateByUrl('/usersform');

        // this.dialogRef = this.dialog.open(UsersFormComponent, {
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

        //         this.contactsService.updateContact(response.getRawValue());

        //     });

    }

    

}


