import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatSnackBar, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
//import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
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
import { JobStatusHistory, JobStatus, JobsList, JobAssignment, PriorityJob } from '../jobs.model';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';
//declare let $: any;

@Component({
    selector: 'prioritizejobs',
    templateUrl: './jobs-prioritize.component.html',
    styleUrls: ['../jobs-load/jobs-load.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class JobsPrioritizeComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    prioritizedJobs: PriorityJob[];
    allJobs: PriorityJob[];
    dataSource: MatTableDataSource<PriorityJob> | null;
    dataSourcePriority: MatTableDataSource<PriorityJob> | null;
    displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_checkbox'];
    priorityColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_buttons'];
    searchInput: FormControl;
    jobPriorityChanged: BehaviorSubject<any> = new BehaviorSubject({});
    
    dialogRef: any;
    progressbar: ProgressBarConfig;
    loggedUserId: string;
    isSavable: boolean;
    sortedArray: number[];
    isGridView: boolean;
    
    matTableInner: number;

    constructor(
        private jobsService: JobsService,
        public dialog: MatDialog,
        public router: Router,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl(''); 
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.isSavable = false;
        this.isGridView = true;

        //this.getAllJobs();
        
        this.dataSource = new MatTableDataSource(this.allJobs);
        this.getPrioritizedJobList(); 

        /* Drag & Drop feature - Not used */
        {
        ////$("#sortable1, #sortable2").sortable({
        ////    connectWith: ".connectedSortable",
        ////    revert: false//,
        ////    //stop: function (event, ui) {
        ////    //    debugger;
        ////    //    this.sortedArray = $("#sortable2").sortable("toArray");
        ////    //}
        ////}).disableSelection();

        ////$("#sortable2").on("sortstop", (event, ui) => {
        ////    console.log(this.prioritizedJobs);
        ////    console.log(this.allJobs);
        ////});
        ////$("#sortable2").on("sortactivate", function (event, ui) {
        ////    //console.log('dropped');
        ////    //debugger;
        ////    console.log(this.allJobs);

        ////    //let job = ui.item;
        ////    //if (job.length > 0)
        ////    //{
        ////    //    job = job[0];
        ////    //    let item = this.allJobs.find((x) => {
        ////    //        if (x.jobid == job.id)
        ////    //            return x;
        ////    //    });

        ////    //    if (this.prioritizedJobs.length == 0)
        ////    //    {                    
        ////    //        this.prioritizedJobs.push(item);
        ////    //    }
        ////    //    else
        ////    //    {
        ////    //        let previousJobId = 0;
        ////    //        if (job.previousElementSibling != null)
        ////    //            previousJobId = job.previousElementSibling.Id;

        ////    //        let itemExists = this.prioritizedJobs.find((x) => {
        ////    //            if (x.jobid == job.id)
        ////    //                return x;
        ////    //        });
        ////    //        if (itemExists == null || itemExists == undefined)
        ////    //        {
        ////    //            if (previousJobId > 0)
        ////    //                this.prioritizedJobs.push(item);
        ////    //            else
        ////    //            {
        ////    //                let index = this.prioritizedJobs.findIndex((x) => {
        ////    //                    if (x.jobid == previousJobId)
        ////    //                        return x;
        ////    //                });
        ////    //                this.prioritizedJobs.splice(0, 0, item);
        ////    //            }
        ////    //        }
        ////    //    }
        ////    //}
        ////});
        }
    }

    ngOnDestroy() {

    }
    
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    //onChangeView(index)
    //{
    //    if (index == 1)
    //    {
    //        this.isGridView = t
    //    }
    //}

    onSelectionChange(job, event)
    {
        //var abc = this.allJobs.filter(x => x.jobid == job.jobid);
        debugger;
    }

    addToPriorityList()
    {
        let selectedJobs = this.allJobs.filter(x => (x.isprioritized && !x.isremoved) || x.isselected == true);

        selectedJobs.map(x => {
            if ((x.isprioritized && !x.isremoved) || x.isselected)
            {
                let job = this.prioritizedJobs.filter(y => y.jobid == x.jobid);
                if (job.length == 0) {
                    this.prioritizedJobs.push(x);
                }
            }
        });

        this.jobPriorityChanged.next(this.prioritizedJobs);
        this.dataSourcePriority = new MatTableDataSource(this.prioritizedJobs);
        this.isSavable = true;
    }

    moveUp(job)
    {
        let index = this.prioritizedJobs.indexOf(job);

        if (index < this.prioritizedJobs.length)
        {
            this.prioritizedJobs.splice(index, 1);
            this.prioritizedJobs.splice(index - 1, 0, job);
            
            this.dataSourcePriority = new MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    }

    moveDown(job)
    {
        let index = this.prioritizedJobs.indexOf(job);

        if (index < this.prioritizedJobs.length) {
            this.prioritizedJobs.splice(index, 1);
            this.prioritizedJobs.splice(index + 1, 0, job);
            
            this.dataSourcePriority = new MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    }

    removePriority(job) {
        let index = this.prioritizedJobs.indexOf(job);

        if (index >= 0)
        {
            this.prioritizedJobs.splice(index, 1);

            this.dataSourcePriority = new MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    }

    savePriority()
    {
        //var ab = $("#sortable").sortable("toArray");
        this.progressbar.showProgress();

        let ids = this.prioritizedJobs.map(x => x.jobid);

        this.jobsService.savePriority(ids.join())
            .then(response => {
                this.isSavable = false;
                this.getAllJobs();
                this.progressbar.hideProgress();
                this.snackComp.showSnackBarPost(response, '');
            });
    }


    private getPrioritizedJobList() {
        this.prioritizedJobs = [];

        this.progressbar.showProgress();
        this.jobsService.getPrioritizedJobList().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                response.map(job => {
                    this.prioritizedJobs.push(job);
                });

                this.getAllJobs();
                this.dataSourcePriority = new MatTableDataSource(this.prioritizedJobs);
            }
        });
    }

    private getAllJobs() {
        let prioritizedJobIds = [];
        this.allJobs = [];

        if (this.prioritizedJobs == undefined)
            this.prioritizedJobs = [];

        this.progressbar.showProgress();
        this.prioritizedJobs.forEach(x => {
            prioritizedJobIds.push(x.jobid);
        });
        
        if (prioritizedJobIds.length > 0) {
            this.jobsService.newJobs.slice(0, 120).map(job => {
                let item = new PriorityJob(job);

                let index = prioritizedJobIds.indexOf(parseInt(job.jobid));
                if (index >= 0) {
                    item.isprioritized = true;
                }
                this.allJobs.push(item);
            });
        }
        else
        {
            this.jobsService.newJobs.slice(0, 120).map(job => {
                let item = new PriorityJob(job);
                this.allJobs.push(item);
            });
        }

        this.dataSource = new MatTableDataSource(this.allJobs);
        this.progressbar.hideProgress();
    }
    
}


@Component({
    selector: 'prioritizedjobs',
    templateUrl: './jobs-prioritized.component.html',
    styleUrls: ['../jobs-load/jobs-load.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class JobsPrioritizedComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    prioritizedJobs: PriorityJob[];
    dataSource: MatTableDataSource<PriorityJob> | null;
    displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_selectedUser', 'jn_buttons'];
    searchInput: FormControl;

    dialogRef: any;
    progressbar: ProgressBarConfig;
    loggedUserId: string;

    matTableInner: number;

    constructor(
        private jobsService: JobsService,
        public dialog: MatDialog,
        public router: Router,
        private loginService: LoginService,
        public snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.searchInput = new FormControl('');
    }

    ngOnInit()
    {
        if (this.loginService.loggedUser.rolename == this.utilities.rn_recruiter)
        {
            this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_buttons'];
        }
        else
        {
            this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_selectedUser'];
        }
        
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new ProgressBarConfig({});

        this.dataSource = new MatTableDataSource(this.prioritizedJobs);
        this.getPrioritizedJobList();
    }

    ngOnDestroy() {

    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    interestedJob(job) {
        this.jobsService.saveInterestedJob(job)
            .then(response => {
                job.isinterested = true;
                this.snackComp.showSnackBarPost(response, '');
            });
    }


    private getPrioritizedJobList() {
        this.prioritizedJobs = [];

        this.progressbar.showProgress();
        this.jobsService.getPrioritizedJobList().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                response.map(job => {
                    this.prioritizedJobs.push(job);
                });

                this.dataSource = new MatTableDataSource(this.prioritizedJobs);
            }
        });
    }

}