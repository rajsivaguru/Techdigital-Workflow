import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Jobs } from '../jobs.model';
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
import { Login2Service } from '../../login/login-2.service';


@Component({
    selector     : 'jobs-details',
    templateUrl  : './jobs-details.component.html',
    styleUrls    : ['./jobs-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class JobsDetailsComponent implements OnInit
{
    //event: CalendarEvent;
    dialogTitle: string;

    formErrors: any;
    jobAssignForm : FormGroup;
    action: string;
    contact: Jobs;

    constructor(
        //public dialogRef: MatDialogRef<JobsFormComponent>,
        //@Inject(MAT_DIALOG_DATA) private data: any,
         private jobsService : JobsService,
        private formBuilder: FormBuilder,
        public router : Router,
        private loginService : Login2Service
    )
    {
        

         this.formErrors = {
            jobid   : { required : true},
            userid : {required : true},

            priorityid   : { required : true},
            expirydate  : { required : true}

        };

        this.action = jobsService.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Contact';
            this.contact = jobsService.editJobs;
        }
        else
        {
            this.dialogTitle = 'New Contact';
            this.contact = new Jobs({});
        }

    }

    ngOnInit()
    {
        
         this.jobAssignForm = this.createContactForm();

         this.jobAssignForm.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        
    }

    createContactForm()
    {
        return this.formBuilder.group({
            id      : [this.contact.jobassignmentid],
            jobid    : [this.contact.jobid],
            userid: [this.contact.userid],
            priorityid  : [this.contact.priorityid],
            description: [this.contact.description],
            expirydate : [this.contact.expirydate],

        });
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
}
