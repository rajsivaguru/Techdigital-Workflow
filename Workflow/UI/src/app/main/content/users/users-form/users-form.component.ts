import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
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

import { LoginService } from '../../login/login.service';

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

    isUpdateEnable : boolean;

    maskPhone : any[];

    constructor(
        // public dialogRef: MatDialogRef<UsersFormComponent>,
        // @Inject(MAT_DIALOG_DATA) private data: any,
        private contactService : UsersService,
        private formBuilder: FormBuilder,
        private configSer : FuseConfigService,
        private router : Router,
        public snackBar: MatSnackBar,
        private loginService : LoginService
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

        this.contactService.getRoleData().then( response => {
            this.roles = response;
        });

        this.action = this.contactService.action;
        //this.roles = this.contactService.roles;

        if ( this.action === 'edit' )
        {
            
            this.isUpdateEnable = false;
            this.dialogTitle = 'Update User';
            this.contact = this.contactService.editContacts;
            

        }
        else
        {
            this.isUpdateEnable = true;
            this.dialogTitle = 'Assign User';
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

         if ( this.action === 'edit' )
            this.contactForm.get('email').disable();

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

    changeRole(event)
    {
        this.contact.roleid = event.value;
        if( this.contact.oldRoleId != this.contact.roleid  || this.contact.oldStatus != this.contact.status )
            this.isUpdateEnable = true;
        else
            this.isUpdateEnable = false;
    }

    changeStatus(event)
    {
        this.contact.status = event.value;
        if( this.contact.oldStatus != this.contact.status || this.contact.oldRoleId != this.contact.roleid  )
            this.isUpdateEnable = true;
        else
            this.isUpdateEnable = false;
    }
    saveUser()
    {

        if(!this.contactForm.valid)
            return;

        this.contact = this.contactForm.getRawValue();
        //this.contact.email = this.contactForm.getRawValue()["email"];
        //this.contact.roleid = this.contactForm.getRawValue()["roleid"];

        // if(this.contact["status"] == "Active" || this.action == "new")
        //     this.contact.status = "1"
        // else
        //     this.contact.status = "0"
        //console.log(this.contactForm.getRawValue())
        this.contactService.updateContact(this.contact)
        .then(response => {

            //console.log(response)
            if (response)
            {
                if(response["Result"]=="1")
                {
                    if (this.action == 'edit')
                        this.router.navigateByUrl('/users');

                    this.openDialog(response["Message"]);
                    this.clearForm();
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
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition : 'top',
            extraClasses: ['mat-light-blue-100-bg']


        });

    }
}
