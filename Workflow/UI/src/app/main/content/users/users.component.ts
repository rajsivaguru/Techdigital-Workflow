import { Component, OnInit,ViewEncapsulation,AfterViewInit, Input, Output, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange, MatDialog, MatDialogRef, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router } from "@angular/router";
import { fuseAnimations } from '../../../core/animations';
import { UsersService } from './users.service';
import { UsersFormComponent } from './users-form/users-form.component';
import { DialogComponent, DialogDataComponent } from '../dialog/dialog.component'
import { LoginService } from '../login/login.service';
import { SnackBarService } from '../dialog/snackbar.service';
import { Utilities } from '../common/commonUtil';

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
    usersList = [];
    absentUsersList = [];
    
    constructor(
        private contactsService: UsersService,
        public dialog: MatDialog,
        private router : Router,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl('');
    }

    ngOnInit()
    {        
        this.contactsService.onSelectedContactsChanged
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                this.contactsService.onSearchTextChanged.next(searchText);
            });
    }

    getUserList() {
        this.contactsService.getContacts(-1);
    }

    assignUser()
    {
        this.contactsService.action =  'new';
        this.router.navigateByUrl('/user');
    }
    
    manageAbsentees()
    {
        this.contactsService.getAbsentUser()
            .then(response => {
                if (response)
                {
                    this.usersList = [];
                    this.absentUsersList = [];

                    response.map(user => {
                        this.usersList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] })

                        if (user["isabsent"]) {
                            this.absentUsersList.push({ "id": user["userid"], "itemName": user["name"] })
                        }
                    });
                    
                    this.usersList = this.utilities.OrderDialogUsers(this.usersList, this.absentUsersList, "id");

                    let dialogUserList = this.dialog.open(DialogDataComponent, {
                        height: this.utilities.absentDialogHeight,
                        width: this.utilities.absentDialogWidth,
                        data: {
                            title: this.utilities.absentDialogTitle,
                            userList: this.usersList,
                            selectedUsers: this.absentUsersList
                        }
                    });

                    dialogUserList.afterClosed().subscribe(result =>
                    {
                        if (result != undefined)
                        {
                            var userids = [];
                            result.map(user => { userids.push(user["id"]) });

                            this.contactsService.saveAbsentUser(userids.join(',')).then(response => {
                                if (response) {
                                    this.snackComp.showUnfinishedSnackBar(response);
                                }
                            });
                        }
                    });
                }
            });
    }    
}
