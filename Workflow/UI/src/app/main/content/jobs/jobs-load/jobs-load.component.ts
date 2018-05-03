import { Component,Inject,  OnDestroy, OnInit, ElementRef,TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { JobsService } from '../jobs.service';
import { UsersService } from '../../users/users.service';
import { Observable } from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { Router }   from '@angular/router';
import { LoginService } from '../../login/login.service';
import { JobStatusHistory, JobStatus, JobsList, JobAssignment } from '../jobs.model';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
@Component({
    selector     : 'jobs-load',
    templateUrl  : './jobs-load.component.html',
    styleUrls    : ['./jobs-load.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class JobsLoadComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    newJobs: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['jn_referenceid', 'jn_title', 'jn_location', 'jn_clientname', 'jn_publisheddate', 'jn_priorityid', 'jn_userlist', 'jn_selectedUser', 'jn_buttons'];
    selectedContacts: any[];
    checkboxes: {};
    searchInput: FormControl;

    hasSelectedNewJobs: boolean;
    onNewJobsChangedSubscription: Subscription;
    onSelectedNewJobsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    usersList = [];
    priorityList = [];
    clientList = [];

    dropdownSettings = {};
    dropdownPrioritySettings = {};
    formModel : any;

    myControl: FormControl = new FormControl();
    filteredOptions: Observable<string[]>;
    jobAssign : JobAssignment;

    constructor(
        private jobsService: JobsService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public router : Router,
        private loginService : LoginService,
        private userService : UsersService
    )
    {
        
        this.searchInput = new FormControl('');
        
        this.onNewJobsChangedSubscription =
            this.jobsService.newJobsChanged.subscribe(contacts => {

                this.newJobs = contacts;

                this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.id] = false;
                // });
            });

        this.onSelectedNewJobsChangedSubscription =
            this.jobsService.onSelectedNewJobsChanged.subscribe(selectedContacts => {
                // for ( const id in this.checkboxes )
                // {
                //     this.checkboxes[id] = selectedContacts.includes(id);
                // }
                // this.selectedContacts = selectedContacts;
            });

        this.onUserDataChangedSubscription =
            this.jobsService.onUserDataChanged.subscribe(user => {
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

        //console.log('job load initialse')
        
        this.dataSource = new FilesDataSource(this.jobsService, this.paginator, this.sort);

        

        this.jobsService.onSelectedNewJobsChanged
            .subscribe(selectedNewJobs => {
                this.hasSelectedNewJobs = selectedNewJobs.length > 0;
            });

        this.searchInput.valueChanges
            .debounceTime(300)
            //.distinctUntilChanged()
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.jobsService.onSearchNewJobsTextChanged.next(searchText);
            });


        
       

        this.userService.getAssignedUser(1).then(response => {

                if (response)
                {
                    response.map(user => {
                            this.usersList.push( { "roleName":user["rolename"], "id":user["userid"], "itemName" : user["name"]})
                        });

                    //console.log(this.usersList);

                }
            });

         this.jobsService.getPriority().then(response => {

                if (response)
                {
                    response.map(priori => {
                            this.priorityList.push( {"id":priori["priorityid"], "itemName" : priori["name"]})
                        });

                    //console.log(this.priorityList);

                }
            });

        // bind the clients
        this.bindClients();
        


        this.dropdownSettings =  { 
                                  singleSelection: false, 
                                  text:"Recruiters",
                                  selectAllText:'Select All',
                                  unSelectAllText:'UnSelect All',
                                  enableSearchFilter: true,
                                  badgeShowLimit: 2
                };

        
       

    }

    bindClients()
    {
        this.clientList = [];
        this.jobsService.getClients().then(response => {

                if (response)
                {
                    response.map(client => {
                            this.clientList.push( {"clientname":client["clientname"]})
                        });

                    // this.filteredOptions = this.clientList.map ;
                    // console.log(this.clientList);

                    this.filteredOptions = this.myControl.valueChanges.startWith(null)
                                   .map(val => val ? this.filterClient(val) : this.clientList.slice());
                

                }
            });
    }

    filterClient(val: string): string[]
    {
        return this.clientList.filter(option =>
            option.clientname.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    clientNameTyped(evet, editJobs : JobsList)
    {
        editJobs.clientname = evet.target.value;

        if (editJobs.clientname == editJobs.oldclientname)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;

        // this.filteredOptions = this.myControl.valueChanges
        //                            .startWith(null)
        //                            .map(val => val ? this.filterClient(val) : this.clientList.slice());
    }

    clientSelected(evet, editJobs : JobsList)
    {
        editJobs.clientname = evet.option.value;

        if (editJobs.clientname == editJobs.oldclientname)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;

        this.filteredOptions = this.myControl.valueChanges
                                   .startWith(null)
                                   .map(val => val ? this.filterClient(val) : this.clientList.slice());
    }
   

    changePriorityLevel(event, editJobs : JobsList)
    {
      
        editJobs.priorityLevel = event.value;

        //console.log(editJobs.priorityLevel)
        //console.log(editJobs.oldPriorityLevel)
        if (editJobs.priorityLevel == editJobs.oldPriorityLevel)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;
    }

    saveItemSelect(editJobs : JobsList){
        //console.log(editJobs.selectedUser);
      
         if(editJobs.clientname == "")
         {
             this.openDialog("Please enter the Client Name!")
             return;
         }
        
         let userid = editJobs.selectedUser.map(user => {
                            return (user["id"])
                        });

        //console.log(editJobs)

        //if(editJobs.selectedUser.length >0 )
        {

        this.jobAssign = new JobAssignment({});
        this.jobAssign.userids = userid;
        this.jobAssign.clientname = editJobs.clientname;
        this.jobAssign.jobid = editJobs.jobid;
        this.jobAssign.priorityid = editJobs.priorityLevel;


         this.jobsService.saveJobUser(this.jobAssign)
            .then(response => {
                editJobs.isSaveEnable = false;
                editJobs.isSaveEnableSelectedUser = false;
                //console.log(response)
                if (response)
                {
                    this.bindClients();
                    if(response["Result"]=="1")
                    {
                        //this.router.navigateByUrl('/jobs');
                        this.openDialog(response["Message"]);
                    }
                    else
                    {
                        this.openDialog(response["Message"]);
                    }
                }
            });
        }
        
    }


    ngOnDestroy()
    {
        this.onNewJobsChangedSubscription.unsubscribe();
        this.onSelectedNewJobsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    synchJobs()
    {
         this.jobsService.synchJobs()
            .then(response => {
                //console.log(response)
                if (response)
                {

                    this.jobsService.getNewJobs();

                    if(response["Result"]=="1")
                    {
                        //this.router.navigateByUrl('/jobs');
                        this.openDialog(response["Message"]);
                    }
                    else
                    {
                        this.openDialog(response["Message"]);
                    }
                }
            });
    }
    editJob(job)
    {

            this.jobsService.action =  'edit';
            this.jobsService.editJobs =  job;
            //console.log( this.jobsService.editJobs.jobassignmentid)
            this.jobsService.getJobStatus(this.jobsService.editJobs.jobassignmentid)
            this.jobsService.getJobStatusHistory(this.jobsService.editJobs.jobassignmentid)

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
                this.jobsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(contactId)
    {
        this.jobsService.toggleSelectedNewJob(contactId);
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

        this.jobsService.updateUserData(this.user);
    }

    mapOrder (array, order, key) {
  
        array.sort( function (A, B) {

            let resultArray = order.filter(
                row => row.id === A[key]);
            
            if (resultArray.length > 0)
                return -1;
            else
                return 1;
            
        });
        
        return array;
    };


    openUserDialog(editJobs : JobsList, userlist, selectedusers)
    {
        userlist = this.mapOrder(userlist, selectedusers, "id" )
        
        let dialogUserList = this.dialog.open(DialogDataComponent, {
            height : "550px",
            width : "400px",
            data: {
                userList: userlist,
                selectedUsers : selectedusers
            }
        });

        

        dialogUserList.afterClosed().subscribe(result => {
            //console.log(editJobs.oldSelectedUser);
            //console.log(editJobs.selectedUser);

            
            if(JSON.stringify(editJobs.selectedUser) === JSON.stringify(editJobs.oldSelectedUser) ) 
                editJobs.isSaveEnableSelectedUser = false;
            else
                editJobs.isSaveEnableSelectedUser = true;
        });
    }
    openDialog(message) : void
    {
        // this.dialog.open(DialogComponent, {
        //     width: '450px',
        //     data: { message : message }
        //     });

        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition : 'top',
            extraClasses: ['mat-light-blue-100-bg']


        });


    }
}

export class FilesDataSource extends DataSource<any>
{

    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
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
    constructor(private jobsService: JobsService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.jobsService.newJobs;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        //console.log(this.jobsService.newJobsChanged)
        const displayDataChanges = [
            this.jobsService.newJobsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        
        return Observable.merge(...displayDataChanges).map(() => {
            let data = this.jobsService.newJobs.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

             if ( this.directiveScroll )
            {
                this.directiveScroll.scrollToTop(0, 500);
                this.directiveScroll.update();
                
            }

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
//displayedColumns = ['title', 'location', 'description', 'publisheddate', 'referenceid', 'userlist', 'buttons'];
   
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                case 'jn_referenceid':
                    [propertyA, propertyB] = [a.referenceid, b.referenceid];
                    break;
                case 'jn_title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'jn_location':
                    [propertyA, propertyB] = [a.location, b.location];
                    break;
                    
                case 'jn_clientname':
                    [propertyA, propertyB] = [a.clientname, b.clientname];
                    break;
                case 'jn_publisheddate':
                    [propertyA, propertyB] = [a.publisheddate, b.publisheddate];
                    break;
               case 'jn_priorityid':
                    [propertyA, propertyB] = [a.priorityid, b.priorityid];
                    break;
                
                case 'jn_userlist':
                    [propertyA, propertyB] = [a.userlist, b.userlist];
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
