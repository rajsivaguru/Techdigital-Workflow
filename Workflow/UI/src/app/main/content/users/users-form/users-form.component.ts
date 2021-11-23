import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataSource } from '@angular/cdk/collections';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Contact, Role } from '../users.model';
import { UsersService } from '../users.service';
import { DialogComponent } from '../../dialog/dialog.component'
import { FuseConfigService } from '../../../../core/services/config.service';
import { LoginService } from '../../login/login.service';
import { SnackBarService } from '../../dialog/snackbar.service';

@Component({
    selector     : 'users',
    templateUrl  : './users-assign.component.html',
    styleUrls    : ['./users-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UsersFormComponent implements OnInit
{
    dialogTitle: string;    
    formErrors: any;
    contactForm: FormGroup;
    action: string;
    contact: Contact;
    roles : Role[];
    isUpdateEnable : boolean;
    maskPhone : any[];

    constructor(
        private contactService : UsersService,
        private formBuilder: FormBuilder,
        private configSer : FuseConfigService,
        private router : Router,
        public snackBar: MatSnackBar,
        private loginService: LoginService,
        private snackComp: SnackBarService
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

        if ( this.action === 'edit' )
            this.contactForm.get('email').disable();
    }

    clearForm() : void
    {
        this.contactForm.reset();
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
        this.contactService.updateContact(this.contact)
        .then(response => {
            if (response)
            {
                if(response["Result"]=="1")
                {
                    if (this.action == 'edit')
                        this.router.navigateByUrl('/users');
                    
                    this.snackComp.showUnfinishedSnackBar(response["Message"]);
                    this.clearForm();
                }
                else
                {
                    this.snackComp.showUnfinishedSnackBar(response["Message"]);
                }
            }
        });
    }


    private createContactForm() {
        this.maskPhone = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        return this.formBuilder.group({
            userid: [this.contact.userid],
            fname: [this.contact.fname],
            lname: [this.contact.lname],
            minitial: [this.contact.minitial],
            email: [this.contact.email,
            [
                Validators.pattern(EMAIL_REGEX)
            ]],
            status: [this.contact.status],
            roleid: [this.contact.roleid],
            workphone: [this.contact.workphone],
            mobile: [this.contact.mobile],
            homephone: [this.contact.homephone],
            location: [this.contact.location]
        });
    }

    private onFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            /* Clear previous errors */
            this.formErrors[field] = { required: true };

            /* Get the control */
            const control = this.contactForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }
}
