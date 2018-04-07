import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { JobsService } from '../jobs.service';
import { Observable } from 'rxjs/Observable';
import { JobsFormComponent } from '../jobs-form/jobs-form.component';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { Router }   from '@angular/router';
import { Login2Service } from '../../login/login-2.service';
import { FuseUtils } from '../../../../core/fuseUtils';

@Component({
    selector     : 'jobs-list',
    templateUrl  : './jobs-list.component.html',
    styleUrls    : ['./jobs-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class JobsListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    jobs: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'jl_referenceid', 'jl_title', 'jl_location', 'jl_publisheddate', 'jl_priority', 'jl_userlist', 'jl_name', 'jl_expirydate', 'jl_isactive', 'jl_createdby', 'jl_createdon'];
    selectedContacts: any[];
    checkboxes: {};

    onContactsChangedSubscription: Subscription;
    onSelectedContactsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private contactsService: JobsService,
        public dialog: MatDialog,
        public router : Router,
        private loginService : Login2Service
    )
    {
        

        this.onContactsChangedSubscription =
            this.contactsService.onContactsChanged.subscribe(contacts => {

                this.jobs = contacts;

                this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.id] = false;
                // });
            });

        this.onSelectedContactsChangedSubscription =
            this.contactsService.onSelectedContactsChanged.subscribe(selectedContacts => {
                // for ( const id in this.checkboxes )
                // {
                //     this.checkboxes[id] = selectedContacts.includes(id);
                // }
                // this.selectedContacts = selectedContacts;
            });

        this.onUserDataChangedSubscription =
            this.contactsService.onUserDataChanged.subscribe(user => {
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
    }

    ngOnDestroy()
    {
        this.onContactsChangedSubscription.unsubscribe();
        this.onSelectedContactsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    

    editJob(job)
    {

            this.contactsService.action =  'edit';
            this.contactsService.editJobs =  job;
            //console.log( this.contactsService.editJobs.jobassignmentid)
            this.contactsService.getJobStatus(this.contactsService.editJobs.jobassignmentid)
            this.contactsService.getJobStatusHistory(this.contactsService.editJobs.jobassignmentid)

            //console.log(job);
            this.router.navigateByUrl('/jobsform');

        // this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data      : {
        //         contact: contact,
        //         action : 'edit'
        //     }
        // });

        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         if ( !response )
        //         {
        //             return;
        //         }
        //         const actionType: string = response[0];
        //         const formData: FormGroup = response[1];
        //         switch ( actionType )
        //         {
        //             /**
        //              * Save
        //              */
        //             case 'save':

        //                 this.contactsService.updateContact(formData.getRawValue());

        //                 break;
        //             /**
        //              * Delete
        //              */
        //             case 'delete':

        //                 this.deleteContact(contact);

        //                 break;
        //         }
        //     });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(contactId)
    {
        this.contactsService.toggleSelectedContact(contactId);
    }

    toggleStar(contactId)
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this.contactsService.updateUserData(this.user);
    }
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

    constructor(private contactsService: JobsService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.contactsService.jobs;
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
            let data = this.contactsService.jobs.slice();

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
//displayedColumns = ['checkbox', 'title', 'publisheddate', 'name', 'priority', 'status', 'description', 'expirydate', 'isactive', 'createdby', 'createdon', 'modifiedby', 'modifiedon'];
   
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                case 'jl_title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'jl_publisheddate':
                    [propertyA, propertyB] = [a.publisheddate, b.publisheddate];
                    break;
                // case 'name':
                //     [propertyA, propertyB] = [a.name, b.name];
                //     break;
                case 'jl_userlist':
                    [propertyA, propertyB] = [a.userlist, b.userlist];
                    break;
                case 'jl_priority':
                    [propertyA, propertyB] = [a.priority, b.priority];
                    break;
                case 'jl_status':
                    [propertyA, propertyB] = [a.status, b.status];
                    break;
                case 'jl_description':
                    [propertyA, propertyB] = [a.modifiedon, b.modifiedon];
                    break;
                case 'jl_expirydate':
                    [propertyA, propertyB] = [a.expirydate, b.expirydate];
                    break;
                 case 'jl_isactive':
                    [propertyA, propertyB] = [a.isactive, b.isactive];
                    break;
                case 'jl_createdby':
                    [propertyA, propertyB] = [a.createdby, b.createdby];
                    break;
                case 'jl_createdon':
                    [propertyA, propertyB] = [a.createdon, b.createdon];
                    break;
                case 'jl_modifiedby':
                    [propertyA, propertyB] = [a.modifiedby, b.modifiedby];
                    break;
                case 'jl_modifiedon':
                    [propertyA, propertyB] = [a.modifiedon, b.modifiedon];
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
