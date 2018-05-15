"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("../../../core/animations");
var forms_1 = require("@angular/forms");
var JobsComponent = /** @class */ (function () {
    function JobsComponent(jobsService, dialog, router, loginService) {
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.searchInput = new forms_1.FormControl('');
    }
    JobsComponent.prototype.newJob = function () {
        this.jobsService.action = 'new';
        this.router.navigateByUrl('/jobsform');
        // this.dialogRef = this.dialog.open(JobsFormComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data      : {
        //         action: 'new'
        //     }
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe((response: FormGroup) => {
        //         if ( !response )
        //         {
        //             return;
        //         }
        //         this.jobsService.updateContact(response.getRawValue());
        //     });
    };
    JobsComponent.prototype.ngOnInit = function () {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        var _this = this;
        this.jobsService.onSelectedContactsChanged
            .subscribe(function (selectedContacts) {
            _this.hasSelectedContacts = selectedContacts.length > 0;
        });
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.jobsService.onSearchTextChanged.next(searchText);
        });
    };
    JobsComponent = __decorate([
        core_1.Component({
            selector: 'fuse-contacts',
            templateUrl: './jobs.component.html',
            styleUrls: ['./jobs.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsComponent);
    return JobsComponent;
}());
exports.JobsComponent = JobsComponent;
