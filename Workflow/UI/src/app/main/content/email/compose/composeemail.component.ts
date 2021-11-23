import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '../../../../core/animations';
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ProgressBarConfig } from '../../../../app.model';
import { JobsService } from '../../jobs/jobs.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ComposeEmail, EmailDetails, ToEmailDetails } from '../email.model';
import { JobsList } from '../../jobs/jobs.model';
import { EmailService } from '../email.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';
declare let $: any;

@Component({
    selector: 'composeemail',
    templateUrl: './composeemail.component.html',
    //styleUrls: ['./jobs-client.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ComposeEmailComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    //@ViewChild('filter') filter: ElementRef;
    //@ViewChild(MatSort) sort: MatSort;
    
    emailDetails: EmailDetails[];
    toDetails: ToEmailDetails[];
    progressbar: ProgressBarConfig;
    jobsAC: FormControl;
    isSavable: boolean = false;
    emailForm: ComposeEmail;
    matTableInner: number;
    
    jobList: JobsList[];
    filteredjobList: Observable<any[]>;
        
    constructor(
        private emailService: EmailService,
        public router: Router,
        private formBuilder: FormBuilder,
        private jobsService: JobsService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.jobsAC = new FormControl();
        this.emailForm = new ComposeEmail({});
        
        $(document).ready(function () {
            $('#summernote').summernote({
                height: 150,
                tabsize: 2,
                toolbar: [
                    ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough', 'superscript', 'subscript']],
                    ['font', ['fontname', 'fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']]
                ]
            });
        });
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new ProgressBarConfig({});
        
        this.getJobList();
        this.getEmailDetails();

        this.jobsAC.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                if (searchText.length == 0)
                {
                    this.clearJob();
                    this.validateForm();
                }
            });
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    selectedEmail(event)
    {
        if (event.value != undefined)
        {
            let emailDetail = this.emailDetails.filter((x) => {
                return x.emailtypeid == event.value;
            });

            this.toDetails = emailDetail[0].todetails;
        }

        this.validateForm();
    }

    selectedTo(event) {
        this.validateForm();
    }

    optionSelectedJob(event) {
        if (event.option != undefined && event.option.value != undefined) {
            let job = this.jobList.filter((x) => {
                return x.jobid == event.option.value;
            });

            this.emailForm.jobid = event.option.value;
            this.emailForm.formattedjob = job[0].formattedtitle;
            this.emailForm.subject = job[0].formattedtitle2;
            this.emailForm.body = job[0].description;

            $('#summernote').summernote('code', this.emailForm.body);
        }
        else {
            this.clearJob();
        }

        this.validateForm();
    }

    clearForm() {
        this.emailForm = new ComposeEmail({});
        $('#summernote').summernote('code', '');
        this.isSavable = false;
        this.bindEmailType();
    }
    
    validateForm() {
        var form = this.emailForm;

        if (form.emailtypeid > 0 && form.jobid > 0 && form.toaddresses.length > 0)
            this.isSavable = true;
        else
            this.isSavable = false;
    }
    
    sendEmail() {
        this.validateForm();
        if (this.isSavable) {
            this.emailForm.body = $('#summernote').summernote('code');
            this.progressbar.showProgress();

            this.emailService.sendEmail(this.emailForm).then(response => {
                if (response) {
                    if (response["ResultStatus"] == "1")
                        this.clearForm();

                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarPost(response, '');
                }
            });
        }
    }


    private getJobList() {
        this.jobList = [];

        if (this.jobsService.newJobs.length == 0)
        {
            this.jobsService.getNewJobs(true).then(response => {
                if (response) {
                    this.jobList = response;
                }
            });
        }
        else
        {
            this.jobList = this.jobsService.newJobs;
        }
        this.jobList.sort(function (a, b) {
            var x = a.formattedtitle;
            var y = b.formattedtitle;

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        this.filteredjobList = this.jobsAC.valueChanges.pipe(startWith(''),
            map(job => job ? this.filterJobs(job) : this.jobList.slice()));
    }

    private getEmailDetails() {
        this.emailService.getEmailDetails().then(response => {
            if (response) {
                this.emailDetails = response;

                this.bindEmailType();
            }
        });
    }

    private bindEmailType() {
        if (this.emailDetails.length == 1) {
            this.toDetails = this.emailDetails[0].todetails;
            this.emailForm.emailtypeid = this.emailDetails[0].emailtypeid;
        }
    }
    
    private filterJobs(content: string) {
        return this.jobList.filter(job =>
            job.title.toLowerCase().indexOf(content.toString().toLowerCase()) === 0);
    }

    private clearJob()
    {
        this.emailForm.jobid = 0;
        this.emailForm.formattedjob = '';
        this.emailForm.subject = '';
        this.emailForm.body = '';
    }
    
}
