import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Contact, Role } from '../users.model';
import { UsersService } from '../users.service';


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
    selector     : 'users-form',
    templateUrl  : './users-assign.component.html',
    styleUrls    : ['./users-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsersFormComponent implements OnInit
{
    //event: CalendarEvent;
    dialogTitle: string;
    
    formErrors: any;
    contactForm: FormGroup;
    action: string;
    contact: Contact;
    roles : Role[];



    maskPhone : any[];

    constructor(
        // public dialogRef: MatDialogRef<UsersFormComponent>,
        // @Inject(MAT_DIALOG_DATA) private data: any,
        private contactService : UsersService,
        private formBuilder: FormBuilder,
        private configSer : FuseConfigService,
        private router : Router,
        private dialog : MatDialog,
        private loginService : Login2Service
    )
    {

        
        this.formErrors = {
            fname   : { required : true},
            lname : {required : true},

            email   : { required : true},
            roleid   : { required : true},
            workphone  : { required : true},

            location  : { required : true}

        };

        this.action = this.contactService.action;
        this.roles = this.contactService.roles;

        if ( this.action === 'edit' )
        {
            //this.dialogTitle = 'Edit Contact';
            this.contact = this.contactService.editContacts;
            

        }
        else
        {
            this.dialogTitle = 'New Contact';
            this.contact = new Contact({});
        }

    }

    ngOnInit()
    {

        this.contactForm = this.createContactForm();

         this.contactForm.valueChanges.subscribe(() => {
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

        
        this.maskPhone  = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        return this.formBuilder.group({
            userid      : [this.contact.userid],

            fname   : [this.contact.fname],
            lname   : [this.contact.lname],
            minitial: [this.contact.minitial],
            
            email   : [this.contact.email,
                                    [
                                        Validators.pattern(EMAIL_REGEX)
                                    ]
                                ],
            status : [this.contact.status],
            roleid: [this.contact.roleid],
            workphone : [this.contact.workphone],
            mobile  : [this.contact.mobile],
            homephone   : [this.contact.homephone],

            location   : [this.contact.location]
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
            const control = this.contactForm.get(field);
            
            
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
        this.contactForm.reset();
        // this.contactForm.patchValue(
        //     {
        //         reposition      : 'No',
        //         groundlevel     : 'AST',
        //         chkspl          : 'No'
        //     }
        // );

       
    }

    saveUser()
    {

        if(!this.contactForm.valid)
            return;

        this.contact.email = this.contactForm.getRawValue()["email"];
        this.contact.roleid = this.contactForm.getRawValue()["roleid"];
        this.contact.status = this.contactForm.getRawValue()["status"];
        //console.log(this.contactForm.getRawValue())
        this.contactService.updateContact(this.contact)
        .then(response => {

            //console.log(response)
            if (response)
            {
                if(response["Result"]=="1")
                {
                    this.router.navigateByUrl('/users');
                    this.openDialog(response["Message"]);
                }
                else
                {
                    this.openDialog(response["Message"]);
                }
            }

            //console.log(response)
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
