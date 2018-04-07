import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { JobStatusHistory, JobStatus, Jobs } from '../jobs.model';
import { JobsService } from '../jobs.service';

import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import { Location } from '@angular/common';
import { DialogComponent } from '../../dialog/dialog.component'

import { FuseConfigService } from '../../../../core/services/config.service';
import { Login2Service } from '../../login/login-2.service';

@Component({
    selector     : 'jobs-form',
    templateUrl  : './jobs-form.component.html',
    styleUrls    : ['./jobs-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class JobsFormComponent implements OnInit
{
    //event: CalendarEvent;
    dialogTitle: string;
    datePipe = new DatePipe("en-US");
    formErrors: any;
    jobAssignForm : FormGroup;
    action: string;
    job: Jobs;
    jobStatus : JobStatus[];
    jobStatusHistory : JobStatusHistory[];

    serviceURL : string;
    Priorities: any[];

  
        

    constructor(
        //public dialogRef: MatDialogRef<JobsFormComponent>,
        //@Inject(MAT_DIALOG_DATA) private data: any,
        private http: Http,
        private _sanitizer: DomSanitizer, 
        private jobsService : JobsService,
        private formBuilder: FormBuilder,
        public router : Router,
        private dialog : MatDialog,
        private loginService : Login2Service,
        private confiSerive : FuseConfigService
    )
    {
        
        this.Priorities = [
        {
            'priorityid'    : 1,
            'Name': 'Low'
        },
        {
            'priorityid'    : 2,
            'Name': 'Medium'
        },
        {
            'priorityid'    : 1,
            'Name': 'High'
        }
        ]

        this.serviceURL = confiSerive.ServiceURL;

         this.formErrors = {
            title   : { required : true},
            name : {required : true},

            priorityid   : { required : true},
            expirydate  : { required : true}

        };

        this.action = jobsService.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Job';
            this.job = jobsService.editJobs;
            this.jobStatus = jobsService.jobStatus; 
            this.jobStatusHistory = jobsService.jobHistory; 
            //console.log(this.jobStatusHistory);
        }
        else
        {
            this.dialogTitle = 'New Job';
            this.job = new Jobs({});
        }

    }

    ngOnInit()
    {
         this.jobAssignForm = this.createJobForm();

         this.jobAssignForm.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
    }

    createJobForm()
    {
        return this.formBuilder.group({
            jobassignmentid      : [this.job.jobassignmentid],
            title    : [this.job.title],
            name: [this.job.name],
            priorityid  : [this.job.priorityid],
            description: [this.job.description],
            //expirydate : [this.job.expirydate],
            expirydate :[
                                {
                                    value       : new Date(this.job.expirydate),
                                    disabled    : false
                                }
                
                                ],
            isactive: [this.job.isactive],

            newJobStatus : '',
            comment : ''
        });
    }

    searchJob = (keyword: any): Observable<any[]> => {
    let url: string = this.serviceURL+'SearchJob?keyword=' + keyword;

        try
        {
            if (keyword) {
            return this.http.get(url)
                .map(res => {
                let json = res.json();
                return JSON.parse(json);
                })
            } else 
            {
                return Observable.of([]);
            }
        }
        catch(ex)
        {
            //console.log(ex)
            return Observable.of([]);
        }
    
    }

    searchUser = (keyword: any): Observable<any[]> => {
        //this.http.get(this.serviceURL+'SearchJob?keyword=' + keyword)
    let url: string = this.serviceURL+'SearchUser?keyword=' + keyword;

        try
        {
            if (keyword) {
            return this.http.get(url)
                .map(res => {
                let json = res.json();
                return JSON.parse(json);
                })
            } else 
            {
                return Observable.of([]);
            }
        }
        catch(ex)
        {
            //console.log(ex)
            return Observable.of([]);
        }
    }

    autocompleListFormatterJob = (data: any) : SafeHtml => {
            let html = `<span class="font-weight-900 font-size-12">${data.title} </span><span class="font-size-10">${data.location} </span>`;
            return this._sanitizer.bypassSecurityTrustHtml(html);
            
        }
    autocompleListFormatterUser = (data: any) : SafeHtml => {
            let html = `<span class="font-weight-900 font-size-12">${data.name} </span><span class="font-size-10">${data.email} </span>`;
            return this._sanitizer.bypassSecurityTrustHtml(html);
            
        }
    autocompleListSelectedJob = (data : any) : void =>
    {
        //console.log('selected')
        return (data["title"]);
        //console.log(data)
    }
    autocompleListSelectedUser = (data : any) : void =>
    {
        //console.log('selected')
        return (data["name"]);
        //console.log(data)
    }

    onFormValuesChanged()
    {
       
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {required : true};
            //console.log(this.formErrors[field])

            // Get the control
            const control = this.jobAssignForm.get(field);
            
            
            if ( control && control.dirty && !control.valid )
            {
                //console.log(control)
                //console.log(control.dirty);
                this.formErrors[field] = control.errors;
            }
        }
    }

    clearForm() : void
     {
        this.jobAssignForm.reset();
        // this.contactForm.patchValue(
        //     {
        //         reposition      : 'No',
        //         groundlevel     : 'AST',
        //         chkspl          : 'No'
        //     }
        // );

       
    }
    updateStatus()
    {
        //let jaid = this.jobAssignForm.getRawValue()["jobassignmentid"];
        let statusid = this.jobAssignForm.getRawValue()["newJobStatus"];
        let comment = this.jobAssignForm.getRawValue()["comment"];
        //console.log(this.jobsService.editJobs.jobassignmentid)
        if( statusid > 0 && statusid != '')
        {
        
            this.jobsService.updateJobStatus(this.jobsService.editJobs.jobassignmentid, statusid , comment)
                .then(response => {

                    //console.log(response)
                    if (response[0])
                    {
                        if(response[0]["Result"]=="1")
                        {
                            //this.router.navigateByUrl('/jobs');
                            this.jobsService.getJobStatus(this.jobsService.editJobs.jobassignmentid)
                            this.jobsService.getJobStatusHistory(this.jobsService.editJobs.jobassignmentid)

                            this.jobStatus = this.jobsService.jobStatus; 
                            this.jobStatusHistory = this.jobsService.jobHistory; 

                            this.openDialog(response[0]["Message"]);
                        }
                        else
                        {
                            this.openDialog(response[0]["Message"]);
                        }
                    }
                });
        }
    }

    saveJob()
    {
        if(!this.jobAssignForm.valid)
            return;

        if(this.action == "new")
        {
            this.job = this.jobAssignForm.getRawValue();
            this.job.jobid = this.job.title["jobid"];
            this.job.userid = this.job.name["userid"];
        }
        else if(this.action == "edit")
        {
            let oldJob  = this.job;
            this.job = this.jobAssignForm.getRawValue();

            if(this.job.title["jobid"] == undefined)
                this.job.jobid = oldJob.jobid;
            else
                this.job.jobid = this.job.title["jobid"];

            if (this.job.name["userid"] == undefined)
                this.job.userid = oldJob.userid;
            else
                this.job.userid = this.job.name["userid"];
            
        }

        this.job.title = '';
        this.job.name = '';

        if (this.job.isactive = "Active")
                this.job.isactive = "1";
            else
                this.job.isactive = "0";
        
        this.job.expirydate = this.datePipe.transform(this.jobAssignForm["controls"]["expirydate"].value, 'MM/dd/yyyy');

        //console.log(this.datePipe.transform(this.job.expirydate, 'MM/dd/yyyy'))

        
        this.jobsService.updateJob(this.job)
        .then(response => {

            //console.log(response)
            if (response)
            {
                if(response["Result"]=="1")
                {
                    this.router.navigateByUrl('/jobs');
                    this.openDialog(response["Message"]);
                }
                else
                {
                    this.openDialog(response["Message"]);
                }
            }
        });
    }

    openDialog(message) : void
    {
        this.dialog.open(DialogComponent, {
            width: '450px',
            data: { message : message }
            });

    }

}
