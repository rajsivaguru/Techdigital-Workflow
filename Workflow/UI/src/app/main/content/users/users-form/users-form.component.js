"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var users_model_1 = require("../users.model");
require("rxjs/add/observable/of");
var UsersFormComponent = /** @class */ (function () {
    function UsersFormComponent(
    // public dialogRef: MatDialogRef<UsersFormComponent>,
    // @Inject(MAT_DIALOG_DATA) private data: any,
    contactService, formBuilder, configSer, router, snackBar, loginService) {
        var _this = this;
        this.contactService = contactService;
        this.formBuilder = formBuilder;
        this.configSer = configSer;
        this.router = router;
        this.snackBar = snackBar;
        this.loginService = loginService;
        this.formErrors = {
            fname: { required: true },
            lname: { required: true },
            email: { required: true },
            roleid: { required: true },
            workphone: { required: true },
            location: { required: true }
        };
        this.contactService.getRoleData().then(function (response) {
            _this.roles = response;
        });
        this.action = this.contactService.action;
        //this.roles = this.contactService.roles;
        if (this.action === 'edit') {
            this.isUpdateEnable = false;
            this.dialogTitle = 'Update User';
            this.contact = this.contactService.editContacts;
        }
        else {
            this.isUpdateEnable = true;
            this.dialogTitle = 'Assign User';
            this.contact = new users_model_1.Contact({});
        }
    }
    UsersFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contactForm = this.createContactForm();
        this.contactForm.valueChanges.subscribe(function () {
            _this.onFormValuesChanged();
        });
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        if (this.action === 'edit')
            this.contactForm.get('email').disable();
    };
    UsersFormComponent.prototype.createContactForm = function () {
        this.maskPhone = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return this.formBuilder.group({
            userid: [this.contact.userid],
            fname: [this.contact.fname],
            lname: [this.contact.lname],
            minitial: [this.contact.minitial],
            email: [this.contact.email,
                [
                    forms_1.Validators.pattern(EMAIL_REGEX)
                ]
            ],
            status: [this.contact.status],
            roleid: [this.contact.roleid],
            workphone: [this.contact.workphone],
            mobile: [this.contact.mobile],
            homephone: [this.contact.homephone],
            location: [this.contact.location]
        });
    };
    UsersFormComponent.prototype.onFormValuesChanged = function () {
        for (var field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = { required: true };
            //console.log(this.formErrors[field])
            // Get the control
            var control = this.contactForm.get(field);
            if (control && control.dirty && !control.valid) {
                //console.log(control)
                //console.log(control.dirty);
                this.formErrors[field] = control.errors;
            }
        }
    };
    UsersFormComponent.prototype.clearForm = function () {
        this.contactForm.reset();
        // this.contactForm.patchValue(
        //     {
        //         reposition      : 'No',
        //         groundlevel     : 'AST',
        //         chkspl          : 'No'
        //     }
        // );
    };
    UsersFormComponent.prototype.changeRole = function (event) {
        this.contact.roleid = event.value;
        if (this.contact.oldRoleId != this.contact.roleid || this.contact.oldStatus != this.contact.status)
            this.isUpdateEnable = true;
        else
            this.isUpdateEnable = false;
    };
    UsersFormComponent.prototype.changeStatus = function (event) {
        this.contact.status = event.value;
        if (this.contact.oldStatus != this.contact.status || this.contact.oldRoleId != this.contact.roleid)
            this.isUpdateEnable = true;
        else
            this.isUpdateEnable = false;
    };
    UsersFormComponent.prototype.saveUser = function () {
        var _this = this;
        if (!this.contactForm.valid)
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
            .then(function (response) {
            //console.log(response)
            if (response) {
                if (response["Result"] == "1") {
                    if (_this.action == 'edit')
                        _this.router.navigateByUrl('/users');
                    _this.openDialog(response["Message"]);
                    _this.clearForm();
                }
                else {
                    _this.openDialog(response["Message"]);
                }
            }
            //console.log(response)
        });
    };
    UsersFormComponent.prototype.openDialog = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-blue-100-bg']
        });
    };
    UsersFormComponent = __decorate([
        core_1.Component({
            selector: 'users-form',
            templateUrl: './users-assign.component.html',
            styleUrls: ['./users-form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], UsersFormComponent);
    return UsersFormComponent;
}());
exports.UsersFormComponent = UsersFormComponent;
