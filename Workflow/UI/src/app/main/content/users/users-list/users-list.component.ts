
import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs/Observable';
import { UsersFormComponent } from '../users-form/users-form.component';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfigService } from '../../../../core/services/config.service';
import { FuseUtils } from '../../../../core/fuseUtils';

import { LoginService } from '../../login/login.service';




@Component({
    selector     : 'users-list',
    templateUrl  : './users-list.component.html',
    styleUrls    : ['./users-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['imgurl', 'name', 'email', 'rolename', 'workphone','mobile','homephone', 'location', 'status'];
    selectedContacts: any[];
    checkboxes: {};

    onContactsChangedSubscription: Subscription;
    onSelectedContactsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private contactsService: UsersService,
        public dialog: MatDialog,
        private router : Router,
        private configSer : FuseConfigService,
        private loginService : LoginService
    )
    {

        
        
        this.onContactsChangedSubscription =
            this.contactsService.onContactsChanged.subscribe(contacts => {

                if(this.paginator != undefined)
                    this.paginator.pageIndex = 0;
                
                this.contacts = contacts;

                this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.userid] = false;
                // });
            });

        this.onSelectedContactsChangedSubscription =
            this.contactsService.onSelectedContactsChanged.subscribe(selectedContacts => {

                //console.log('selectec contact changed')

                for ( const userid in this.checkboxes )
                {
                    this.checkboxes[userid] = selectedContacts.includes(userid);
                }
                this.selectedContacts = selectedContacts;
            });

        this.onUserDataChangedSubscription =
            this.contactsService.onUserDataChanged.subscribe(user => {

                //console.log('user data changed')
                this.user = user;
            });

    }

    ngOnInit()
    {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        
        this.dataSource = new FilesDataSource(this.contactsService, this.paginator, this.sort);

        //  Observable.fromEvent(this.filter.nativeElement, 'keyup')
        //           .debounceTime(150)
        //           .distinctUntilChanged()
        //           .subscribe(() => {
        //               if ( !this.dataSource )
        //               {
        //                   return;
        //               }
        //               this.dataSource.filter = this.filter.nativeElement.value;
        //           });
    }

    ngOnDestroy()
    {
        this.onContactsChangedSubscription.unsubscribe();
        this.onSelectedContactsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    editContact(contact)
    {

        this.contactsService.action =  'edit';
        this.contactsService.editContacts =  contact;
        this.router.navigateByUrl('/usersform');
        
    }

    /**
     * Delete Contact
     */
    // deleteContact(contact)
    // {
    //     this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
    //         disableClose: false
    //     });

    //     this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    //     this.confirmDialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         {
    //             this.contactsService.deleteContact(contact);
    //         }
    //         this.confirmDialogRef = null;
    //     });

    // }

    // onSelectedChange(contactId)
    // {
    //     this.contactsService.toggleSelectedContact(contactId);
    // }

    // toggleStar(contactId)
    // {
    //     if ( this.user.starred.includes(contactId) )
    //     {
    //         this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
    //     }
    //     else
    //     {
    //         this.user.starred.push(contactId);
    //     }

    //     this.contactsService.updateUserData(this.user);
    // }
}

export class FilesDataSource extends DataSource<any>
{
    _filterChange = new BehaviorSubject('');
    _filteredDataChange = new BehaviorSubject('');

    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    constructor(private contactsService: UsersService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.contactsService.contacts;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this.contactsService.onContactsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
       return Observable.merge(...displayDataChanges).map(() => {
            let data = this.contactsService.contacts.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

            // Grab the page's slice of data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
    }

    filterData(data)
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[]
    {
        if ( !this._sort.active || this._sort.direction === '' )
        {
            return data;
        }
//displayedColumns = ['imgurl', 'name', 'email', 'rolename', 'workphone','mobile','homephone', 'location', 'status'];
   
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'email':
                    [propertyA, propertyB] = [a.email, b.email];
                    break;
                case 'rolename':
                    [propertyA, propertyB] = [a.rolename, b.rolename];
                    break;
                case 'workphone':
                    [propertyA, propertyB] = [a.workphone, b.workphone];
                    break;
                case 'mobile':
                    [propertyA, propertyB] = [a.mobile, b.mobile];
                    break;
                case 'homephone':
                    [propertyA, propertyB] = [a.homephone, b.homephone];
                    break;
                case 'location':
                    [propertyA, propertyB] = [a.location, b.location];
                    break;
                case 'status':
                    [propertyA, propertyB] = [a.status, b.status];
                    break;
               
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect()
    {
    }
}
