import { Component, OnDestroy, Input, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { RecruitersService } from './recruiters.service';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { SnackBarService } from '../dialog/snackbar.service'
import { RecruitersJobs } from './recruiters.model';
import { JobStatus } from '../jobs/jobs.model';
import { Router } from "@angular/router";
import { LoginService } from '../login/login.service';
import { JobsService } from '../jobs/jobs.service';
import { VisaService } from '../visa/visa.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { DialogComponent } from '../dialog/dialog.component'
import { FuseUtils } from '../../../core/fuseUtils';
import * as moment from 'moment';
import 'rxjs/add/observable/interval';
import { Utilities } from '../common/commonUtil';

@Component({
    selector: 'app-inline-message',
    template: 'Detail: {{ job.title }}',
      styles: [`
        :host {
          display: block;
          padding: 24px;
          color: red;
          background: rgba(0,0,0,0.1);
        }
      `]
})

export class InlineMessageComponent {
    @Input() job: RecruitersJobs;

    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
    selector     : 'fuse-recruiters',
    templateUrl  : './recruiters.component.html',
    styleUrls    : ['./recruiters.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fuseAnimations, trigger('detailExpand', [
            //state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('collapsed', style({ height: '*', visibility: 'visible' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ]),
    ],
})

export class RecruitersComponent implements OnInit
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    @Input('eventDate') eventDate;
    
    @Input() rjobs: RecruitersJobs[];
    @ViewChild('cdkrow', { read: ViewContainerRef }) containers: ViewContainerRef;
    @ViewChild(InlineMessageComponent) inlineComponent: InlineMessageComponent;
    expandedRow: number;
    matTableInner: number;

    searchInput: FormControl;
    onRecruiterJobChangedSubscription: Subscription;
    jobStatus : JobStatus[];
    jobDuration : number;
    alertDuration : number;
    hasSelectedNewJobs: boolean;
    newJobs: any;
    user: any;
    dialogRef: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['r_referenceid', 'r_title', 'r_location', 'r_expirydate', 'r_priorityLevel', 'r_createdby', 'r_startbutton'];
    selectedContacts: any[];
    checkboxes: {};
    noOfJobs: any[] = [];
    isExpansionDetailRow = (i: number, row: Object) => {
        //return row.hasOwnProperty('detailRow');
        if(i%2 == 0)
            return false;
        return true;
    }
    showDetail: boolean = false;
    activeJob: RecruitersJobs;

    constructor(
        private recruiterService: RecruitersService,
        private jobsService: JobsService,
        public dialog: MatDialog,
        private fuseConfig: FuseConfigService,
        private snackComp: SnackBarService,
        private utilities: Utilities,
        private router : Router,
        private loginService: LoginService,
        private visaService: VisaService,
        private resolver: ComponentFactoryResolver
    )
    {
        this.searchInput = new FormControl('');
        this.jobDuration =  this.fuseConfig.JobTimerDuration
        this.alertDuration =  this.fuseConfig.AlertTimerDuration
    }

    ngOnInit()
    {
        this.dataSource = new FilesDataSource(this.recruiterService, this.paginator, this.sort);
        this.searchInput.valueChanges
            .debounceTime(300)
            //.distinctUntilChanged()
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.recruiterService.onSearchTextChanged.next(searchText);
            });

        if(this.jobDuration == undefined)
            this.jobDuration = 3600;
    
        if(this.alertDuration  == undefined)
            this.alertDuration = 30;

        this.rjobs = this.recruiterService.recruiterJobs;
        this._getRunningJob();
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    goToScreening(recuriterJobs: any)
    {
        if (this.visaService.recruiterSelectedJob != undefined)
        {
            if (this.visaService.recruiterSelectedJob.length > 0)
            {
                //var exists = this.visaService.recruiterSelectedJob.find(x => x.jobid == recuriterJobs.jobid);
                var exists = this.visaService.recruiterSelectedJob.find(x => x.userid == this.loginService.loggedUser.userid);
                if (exists != undefined)
                {
                    var index = this.visaService.recruiterSelectedJob.indexOf(exists);
                    if(index >= 0)
                        this.visaService.recruiterSelectedJob.splice(index, 1);
                }

                this._addToTemp(recuriterJobs);
            }
            else
                this._addToTemp(recuriterJobs);

            this.router.navigateByUrl('/visaquestion');
        }
        else
        {
            this._addToTemp(recuriterJobs);
            this.router.navigateByUrl('/visaquestion');
        }
    }

    startJobTimer(recuriterJobs : RecruitersJobs)
    {
        this.activeJob = recuriterJobs;
        
        if (this.noOfJobs != undefined && this.noOfJobs.length >= 2)
        {
            this.snackComp.showSimpleWarning(this.utilities.maxJobMessage);
        }
        else
        {
            this.recruiterService.startRecruiterJob(recuriterJobs.jobassignmentid).then(response => {
                if (response["ResultStatus"] == "1") {
                    recuriterJobs.jobassignmentstatusid = response["Output"];
                    recuriterJobs.expansionPanelId = true;
                    recuriterJobs.endtime = '';
                    this.noOfJobs.push(recuriterJobs.jobassignmentstatusid);
                    this.jobTimerSubscribe(recuriterJobs);

                    response["SuccessMessage"] = this._getMessage(this.utilities.jobStartMessage, recuriterJobs.referenceid, recuriterJobs.title);
                }
                this.snackComp.showSnackBarPost(response, '');
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

        recuriterJobs.confirmDialogRef.afterOpen().subscribe(result =>
        {
            recuriterJobs.dialogDiff = 1;
            recuriterJobs.dialogCountDown = Observable.interval(5000).map(value => {
                return recuriterJobs.dialogDiff = recuriterJobs.dialogDiff + 5;
            });      
            recuriterJobs.dialogTimer =   recuriterJobs.dialogCountDown.subscribe(value => {
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

        recuriterJobs.confirmDialogRef.afterClosed().subscribe(result =>
        {
            if (!result)
            {
                recuriterJobs.comment = "stopped"
                this.stopJobTimer(recuriterJobs); 
            }
            if (result)
            {
                recuriterJobs.diff = 1;
                this.jobTimerSubscribe(recuriterJobs);
            }
            recuriterJobs.confirmDialogRef = null;
        });
    }

    showDetails(recuriterJobs: RecruitersJobs)
    {
        this.activeJob = recuriterJobs;
        this.showDetail = true;
    }

    stopJobTimer(recuriterJobs : RecruitersJobs )
    {
        if(recuriterJobs.comment == '')
        {
            this.snackComp.showSimpleWarning('Please fill the Comment');
        }
        else
        {
            this.recruiterService.stopRecruiterJob(recuriterJobs).then(response => {
                if (response["ResultStatus"] == "1")
                {
                    this.showDetail = false;
                    var index = this.noOfJobs.indexOf(recuriterJobs.jobassignmentstatusid);

                    if (index >= 0)
                        this.noOfJobs.splice(index, 1);

                    recuriterJobs.dialogTimer.unsubscribe();
                    recuriterJobs.jobTimer.unsubscribe();
                    response["SuccessMessage"] = this._getMessage(this.utilities.jobStopMessage, recuriterJobs.referenceid, recuriterJobs.title);
                }

                this.snackComp.showSnackBarPost(response, '');
            });
        }
    }
    
    private _addToTemp(job) {
        this.visaService.recruiterSelectedJob.push({ userid: this.loginService.loggedUser.userid, jobid: job.jobid, job: job });
    }

    private _getRunningJob() {
        this.recruiterService.recruiterJobs.map(job => {
            if ((job.jobassignmentstatusid > 0 && job.endtime == '') || (job.jobassignmentstatusid != 0 && job.isactive))
                this.noOfJobs.push(job.jobassignmentstatusid);
        });
    }

    private _getMessage(message, code, title)
    {
        message = message.replace('{0}', code);
        message = message.replace('{1}', title);
        return message;
    }

    /* Not Used */
    expandRow(index: number)
    {
        if (this.expandedRow != null) {
            // clear old message
            this.containers[this.expandedRow].clear();
        }

        if (this.expandedRow === index) {
            this.expandedRow = null;
        }
        else
        {
            let rjob = this.rjobs[index];

            //inlineComponent
            ////let factory = this.resolver.resolveComponentFactory(InlineMessageComponent);
            ////const container2 = this.containers;
            //////container2.clear();
            ////const comp = container2.createComponent(factory);
            ////comp.instance.data = "jobs";
            ////this.expandedRow = index;

            const factory = this.resolver.resolveComponentFactory(InlineMessageComponent);
            const container2 = this.containers;
            const cont3 = this.inlineComponent;
            //container2.clear();
            const comp = container2.createComponent(factory);
            //comp.instance.data = "jobs";
            this.expandedRow = index;
        }
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

