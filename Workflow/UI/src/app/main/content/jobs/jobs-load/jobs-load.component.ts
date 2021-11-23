import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { fuseAnimations } from '../../../../core/animations';

import { LoginService } from '../../login/login.service';
import { JobsService } from '../jobs.service';
import { UsersService } from '../../users/users.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ProgressBarConfig } from '../../../../app.model';
import { JobStatusHistory, JobStatus, JobsList, JobAssignment } from '../jobs.model';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector     : 'jobs',
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
    searchInput: FormControl;

    hasSelectedNewJobs: boolean;
    onNewJobsChangedSubscription: Subscription;
    onSelectedNewJobsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;
    progressbarConfig: ProgressBarConfig;

    usersList = [];
    priorityList = [];
    clientList = [];
    savableJobs = Array<JobsList>();
    savableJobAssignments = Array<JobAssignment>();
    dropdownSettings = {};
    
    filteredOptions: Observable<string[]>;
    jobAssign: JobAssignment;
    isAllJobsValid: boolean = false;
    loggedUserId: string;

    matTableInner: number;
    
    constructor(
        private jobsService: JobsService,
        public dialog: MatDialog,
        public router : Router,
        private loginService : LoginService,
        private userService: UsersService,
        public snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl('');
        
        this.onNewJobsChangedSubscription =
            this.jobsService.newJobsChanged.subscribe(contacts => {
                this.newJobs = contacts;
            });

        this.onSelectedNewJobsChangedSubscription =
            this.jobsService.onSelectedNewJobsChanged.subscribe(selectedContacts => {
            });

        this.onUserDataChangedSubscription =
            this.jobsService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbarConfig = new ProgressBarConfig({});
        this.loggedUserId = this.jobsService.getLoginId();
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
        
        this.getAssignmentUserList();

        if(this.priorityList.length == 0)
            this.getPriorityList();

        this.getClientList();
        
        this.dropdownSettings =  { 
            singleSelection: false, 
            text:"Recruiters",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            badgeShowLimit: 2
        };
    }

    ngOnDestroy() {
        this.onNewJobsChangedSubscription.unsubscribe();
        this.onSelectedNewJobsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    synchJobs() {
        this.showHideProgressBar(true);

        this.jobsService.synchJobs()
            .then(response => {
                if (response["Result"] == "1") {
                    this.jobsService.getNewJobs(true)
                        .then(result => {
                            this.showHideProgressBar(false);
                            this.snackComp.showSimpleSnackBar(response["Message"]);
                        })
                }
                else {
                    this.showHideProgressBar(false);
                    this.snackComp.showSimpleSnackBar(response["Message"]);
                }
            });
    }

    prioritizeJob()
    {
        this.router.navigateByUrl('prioritizejob');
    }

    onClientChanged(event, editJob: JobsList)
    {
        editJob.clientname = event.value;
        this.isAllJobsValid = this.isValidJob(editJob);
    }

    onPriorityChanged(event, editJob : JobsList)
    {
        editJob.priorityLevel = event.value;
        this.isAllJobsValid = this.isValidJob(editJob);
    }

    openAssignToModal(editJob: JobsList, userlist, selectedusers) {
        userlist = this.mapOrder(userlist, selectedusers, "id")

        let dialogUserList = this.dialog.open(DialogDataComponent, {
            height: "550px",
            width: "400px",
            data: {
                title: 'Assign To',
                userList: userlist,
                selectedUsers: selectedusers,
                groupByField: 'roleName'
            }
        });

        dialogUserList.afterClosed().subscribe(result => {
            if (result == undefined)
            {
                editJob.isValid = false;
                editJob.selectedUser = [];

                editJob.oldSelectedUser.forEach(sel => {
                    editJob.selectedUser.push(sel);
                });
            }
            else {
                this.isAllJobsValid = this.isValidJob(editJob);
            }
        });
    }
    
    saveJob(editJob: JobsList)
    {
        let userid = editJob.selectedUser.map(user => {
            return (user["id"])
        });

        this.jobAssign = new JobAssignment({});
        this.jobAssign.userids = userid;
        this.jobAssign.clientname = editJob.clientname;
        this.jobAssign.jobid = editJob.jobid;
        this.jobAssign.priorityid = editJob.priorityLevel;
        this.jobAssign.loginid = this.loggedUserId;
        this.showHideProgressBar(true);

        this.jobsService.saveJobAssignment(this.jobAssign)
            .then(response => {
                editJob.isValid = false;
                this.isAllJobsValid = false;
                this.showHideProgressBar(false);
                this.getAssignmentUserList();
                this.snackComp.showSnackBarPost(response, '');
            });
    }

    saveJobs() {
        if (this.savableJobs.length > 0)
        {
            /* Clear all the previos jobs. */
            this.savableJobAssignments = [];
            this.savableJobs.forEach((job) =>
            {
                let userid = job.selectedUser.map(user => { return (user["id"]) });
                var jobAssignment = new JobAssignment({});

                jobAssignment.jobid = job.jobid;
                jobAssignment.userids = userid;
                jobAssignment.clientname = job.clientname;
                jobAssignment.priorityid = job.priorityLevel;
                jobAssignment.loginid = this.loggedUserId;
                
                this.savableJobAssignments.push(jobAssignment);
            });

            this.showHideProgressBar(true);

            this.jobsService.saveJobsAssignment(this.savableJobAssignments)
                .then(response => {
                    this.isAllJobsValid = false;
                    this.showHideProgressBar(false);
                    this.getAssignmentUserList();
                    this.snackComp.showSnackBarPost(response, '');

                    if (response["ResultStatus"] == "1")
                    {
                        this.savableJobs = [];
                    }
                });
        }
    }

    private getAssignmentUserList() {
        this.showHideProgressBar(true);
        this.usersList = [];
        this.userService.getAssignedUser(1).then(response => {
            if (response) {
                this.showHideProgressBar(false);
                response.map(user => {
                    this.usersList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] })
                });
            }
        });
    }

    private getPriorityList() {
        this.jobsService.getPriority().then(response => {
            if (response) {
                response.map(priority => {
                    this.priorityList.push({ "id": priority["priorityid"], "itemName": priority["name"] })
                });
            }
        });
    }

    private getClientList() {
        this.clientList = [];
        this.jobsService.getClients().then(response => {
            if (response) {
                response.map(client => {
                    this.clientList.push({ "id": client["id"], "clientname": client["clientname"] })
                });
            }
        });
    }

    private showHideProgressBar(isVisible)
    {
        this.progressbarConfig.isVisible = isVisible;
    }

    private mapOrder(array, order, key) {
        var recruiter = [], leader = [], recruiterSel = [], leaderSel = [];

        array.filter((x) => {
            if (x.roleName.toLowerCase() === this.utilities.rn_recruiter.toLocaleLowerCase())
                recruiter.push(x);             
        });

        array.filter((x) => {
            if (x.roleName.toLowerCase() === this.utilities.rn_teamlead.toLocaleLowerCase())
                leader.push(x);
        });

        order.forEach(item => {
            recruiter.filter((x) => {
                if (x.id === item.id)
                    recruiterSel.push(x);
            });
        });

        order.forEach(item => {
            leader.filter((x) => {
                if (x.id === item.id)
                    leaderSel.push(x);
            });
        });

        recruiterSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return 1; }
            if (x > y) { return -1; }
            return 0;
        });
        
        leaderSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return 1; }
            if (x > y) { return -1; }
            return 0;
        });

        recruiter.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        leader.sort(function(a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        recruiterSel.forEach(sel => {
            var user = recruiter.filter(item => { return item.id == sel.id });
            var index = recruiter.indexOf(user[0]);

            recruiter.splice(index, 1);
            recruiter.splice(0, 0, user[0]);
        });

        leaderSel.forEach(sel => {
            var user = leader.filter(item => { return item.id == sel.id });
            var index = leader.indexOf(user[0]);

            leader.splice(index, 1);
            leader.splice(0, 0, user[0]);
        });

        var result = recruiter.concat(leader);
        return result;
    };
    
    private isValidJob(job: JobsList) {
        if (job.clientname == "" || job.clientname == undefined || job.priorityLevel == "" || job.priorityLevel == undefined) {
            job.isValid = false;
        }

        if (job.priorityLevel != "" && job.clientname != "" && (job.priorityLevel != job.oldPriorityLevel || job.clientname != job.oldclientname || JSON.stringify(job.selectedUser) != JSON.stringify(job.oldSelectedUser))) {
            for (var i = this.savableJobs.length - 1; i >= 0; i--) {
                if (this.savableJobs[i].jobid == job.jobid) {
                    this.savableJobs.splice(i, 1);
                    break;
                }
            }

            this.savableJobs.push(job);
            job.isValid = true;
        }
        else {
            for (var i = this.savableJobs.length - 1; i >= 0; i--) {
                if (this.savableJobs[i].jobid == job.jobid) {
                    this.savableJobs.splice(i, 1);
                    break;
                }
            }
            job.isValid = false;
        }

        if (this.savableJobs.length > 0)
            return true;
        return false;
    }


    /* Code not used; Used previously.  Maybe useful for future. */
    /*
    clientNameTyped(evet, editJobs : JobsList)
    {
        editJobs.clientname = evet.target.value;

        if (editJobs.clientname == editJobs.oldclientname)
        {
            editJobs.isSaveEnable = false;
            this.isJobSavable = false;
        }
        else
        {
            editJobs.isSaveEnable = true;
            this.isJobSavable = true;
        }
    }

    clientSelected(evet, editJobs : JobsList)
    {
        editJobs.clientname = evet.option.value;

        if (editJobs.clientname == editJobs.oldclientname)
        {
            editJobs.isSaveEnable = false;
            this.isJobSavable = false;
        }
        else
        {
            editJobs.isSaveEnable = true;
            this.isJobSavable = true;
        }   

        this.filteredOptions = this.myControl.valueChanges
                                   .startWith(null)
                                   .map(val => val ? this.filterClient(val) : this.clientList.slice());
    }

    filterClient(val: string): string[]
    {
        return this.clientList.filter(option => option.clientname.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    */

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
    constructor(private jobsService: JobsService, private _paginator: MatPaginator, private _sort: MatSort)
    {
        super();
        this.filteredData = this.jobsService.newJobs;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
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
