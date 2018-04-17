import { Component, OnDestroy, Input, OnInit, ElementRef,TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RecruitersService } from './recruiters.service';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import { RecruitersJobs } from './recruiters.model';
import { JobStatus } from '../jobs/jobs.model';
import { Router } from "@angular/router";
import { LoginService } from '../login/login.service';
import { JobsService } from '../jobs/jobs.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { DialogComponent } from '../dialog/dialog.component'
import { FuseUtils } from '../../../core/fuseUtils';

import * as moment from 'moment';
import 'rxjs/add/observable/interval';


@Component({
    selector     : 'fuse-recruiters',
    templateUrl  : './recruiters.component.html',
    styleUrls    : ['./recruiters.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RecruitersComponent implements OnInit
{

    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    @Input('eventDate') eventDate;

    jobStatus : JobStatus[];

    jobDuration : number;
    alertDuration : number;


    newJobs: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['r_referenceid', 'r_title', 'r_location', 'r_expirydate', 'r_priorityLevel', 'r_createdby', 'r_startbutton', 'r_stopbutton'];
    selectedContacts: any[];
    checkboxes: {};
    searchInput: FormControl;

    hasSelectedNewJobs: boolean;
    onRecruiterJobChangedSubscription: Subscription;

    dialogRef: any;

    //confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(
        private recruiterService: RecruitersService,
        private jobsService: JobsService,
        public dialog: MatDialog,
        private fuseConfig: FuseConfigService,
        public snackBar: MatSnackBar,
        private router : Router,
        private loginService : LoginService
    )
    {

        this.searchInput = new FormControl('');

        this.jobDuration =  this.fuseConfig.JobTimerDuration
        this.alertDuration =  this.fuseConfig.AlertTimerDuration
        
        
    }

    ngOnInit()
    {
        
        
        {
        this.dataSource = new FilesDataSource(this.recruiterService, this.paginator, this.sort);
        this.searchInput.valueChanges
            .debounceTime(300)
            //.distinctUntilChanged()
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.recruiterService.onSearchTextChanged.next(searchText);
            });
        }


        if(this.jobDuration == undefined)
            this.jobDuration = 3600;
    
        if(this.alertDuration  == undefined)
            this.alertDuration = 30;
    
       
        
    }

    validateSubmission(event)
    {
        //console.log(event.value)
        return false;
    }

    startJobTimer(recuriterJobs : RecruitersJobs )
    {
        //console.log(recuriterJobs)
        const noOfJobs: any[] = [];
        this.recruiterService.recruiterJobs.map(job => {

            if(job.jobassignmentstatusid > 0 && job.endtime == '')
                noOfJobs.push(job.jobassignmentstatusid)

        });

        if (noOfJobs != undefined && noOfJobs.length >= 2)
        {
                this.openDialog('Maximum of 2 jobs only can be started at a time.');
        }
        else
        {
            this.recruiterService.startRecruiterJob(recuriterJobs.jobassignmentid).then (respone => {
                    //this.jobStatus = respone
                    this.openDialog('Your job has been Started.');

                    if(respone != null && respone != '' && respone != undefined )
                    {
                        recuriterJobs.jobassignmentstatusid = respone[0]["Id"]
                        this.jobTimerSubscribe(recuriterJobs);
                    }
                });
        }
         
       


    }

    jobTimerSubscribe(recuriterJobs : RecruitersJobs)
    {

        recuriterJobs.countDown =
                                Observable
                                    .interval(5000)
                                    .map(value => {
                                        return recuriterJobs.diff = recuriterJobs.diff + 5;
                                    })
                                    .map(value => {
                                        const timeLeft = moment.duration(value, 'seconds');

                                        return {
                                            days   : timeLeft.asDays().toFixed(0),
                                            hours  : timeLeft.hours(),
                                            minutes: timeLeft.minutes(),
                                            seconds: timeLeft.seconds()
                                        };
                                    });        
                        
                        recuriterJobs.jobTimer = recuriterJobs.countDown.subscribe(value => {
                            //console.log(value)
                            recuriterJobs.countdown = value;

                            if(recuriterJobs.countdown["seconds"] > this.jobDuration )
                            {
                                recuriterJobs.jobTimer.unsubscribe();
                                this.openUserDialog(recuriterJobs);
                                
                            }

                        });
    }

    openUserDialog(recuriterJobs : RecruitersJobs)
    {
        recuriterJobs.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

         recuriterJobs.confirmDialogRef.afterOpen().subscribe(result =>{
                recuriterJobs.dialogDiff = 1;
                recuriterJobs.dialogCountDown = Observable.interval(5000).map(value => {
                                        return recuriterJobs.dialogDiff = recuriterJobs.dialogDiff + 5;
                                    });      
                recuriterJobs.dialogTimer =   recuriterJobs.dialogCountDown.subscribe(value => {
                            //console.log(value)
                            recuriterJobs.dialogCountDown = value;
                            if(recuriterJobs.dialogCountDown > this.alertDuration )
                            {
                                recuriterJobs.dialogTimer.unsubscribe();
                                if(recuriterJobs.confirmDialogRef != null)
                                    recuriterJobs.confirmDialogRef.close();
                                
                            }

                        });
        });

        recuriterJobs.confirmDialogRef.componentInstance.jobCode = recuriterJobs.referenceid;
        recuriterJobs.confirmDialogRef.componentInstance.confirmMessage = 'Time Elapsed! Do you want to continue?';
        //this.confirmDialogRef.componentInstance.data = recuriterJobs;

        recuriterJobs.confirmDialogRef.afterClosed().subscribe(result => {
            if (!result )
            {
                recuriterJobs.comment = "stopped"
                this.stopJobTimer(recuriterJobs)
                
            }
            if (result )
            {
                recuriterJobs.diff = 1;
                this.jobTimerSubscribe(recuriterJobs);
                
            }
            recuriterJobs.confirmDialogRef = null;
        });
    }

    stopJobTimer(recuriterJobs : RecruitersJobs )
    {
        // this.jobsService.getJobStatus(recuriterJobs.jobassignmentid).then (respone => {
        //     this.jobStatus = respone
        //     //console.log(this.jobStatus )
        // });
        //comment.checkValidity()
        //recuriterJobs.status = '0';
        if(recuriterJobs.comment == ''  )
        {
            this.openDialog('Please fill the Comment.');
        }
        else
        {
            this.recruiterService.stopRecruiterJob(recuriterJobs.jobassignmentid, recuriterJobs.jobassignmentstatusid, recuriterJobs.submission, recuriterJobs.comment ).then (respone => {
                this.openDialog('Your job has been Stopped.');

                recuriterJobs.dialogTimer.unsubscribe();
                recuriterJobs.jobTimer.unsubscribe();
            });
        }
    }

    clearRecuriterStatus()
    {

    }

    saveRecuriterStatus(recuriterJobs : RecruitersJobs)
    {
        //console.log(recuriterJobs)

    }


    ngOnDestroy()
    {
        //this.onRecruiterJobChangedSubscription.unsubscribe();
    }

    openDialog(message) : void
    {
        // this.dialog.open(DialogComponent, {
        //     width: '450px',
        //     data: { message : message }
        //     });

        this.snackBar.open(message, '', {
            duration: 3000,
            verticalPosition : 'top'
        });


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
    constructor(private recuriterService: RecruitersService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.recuriterService.recruiterJobs;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        //console.log(this.jobsService.newJobsChanged)
        const displayDataChanges = [
            this.recuriterService.onRecruiterJobChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        
        return Observable.merge(...displayDataChanges).map(() => {
            let data = this.recuriterService.recruiterJobs.slice();

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
//displayedColumns = ['r_referenceid', 'r_title', 'r_location', 'r_expirydate', 'r_priorityLevel', 'r_createdby', 'r_startbutton', 'r_stopbutton'];
        
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                 case 'r_referenceid':
                    [propertyA, propertyB] = [a.referenceid, b.referenceid];
                    break;
                case 'r_title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'r_location':
                    [propertyA, propertyB] = [a.location, b.location];
                    break;
                case 'r_expirydate':
                    [propertyA, propertyB] = [a.expirydate, b.expirydate];
                    break;
                case 'r_priorityLevel':
                    [propertyA, propertyB] = [a.priorityid, b.priorityid];
                    break;
                 case 'r_createdby':
                    [propertyA, propertyB] = [a.createdby, b.createdby];
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

