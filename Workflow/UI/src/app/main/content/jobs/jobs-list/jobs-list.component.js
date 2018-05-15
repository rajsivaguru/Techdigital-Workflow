"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var material_1 = require("@angular/material");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var confirm_dialog_component_1 = require("../../../../core/components/confirm-dialog/confirm-dialog.component");
var collections_1 = require("@angular/cdk/collections");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var JobsListComponent = /** @class */ (function () {
    function JobsListComponent(contactsService, dialog, router, loginService) {
        var _this = this;
        this.contactsService = contactsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.displayedColumns = ['jl_referenceid', 'jl_title', 'jl_location', 'jl_publisheddate', 'jl_priority', 'jl_userlist', 'jl_name', 'jl_expirydate', 'jl_isactive', 'jl_createdby', 'jl_createdon'];
        this.onContactsChangedSubscription =
            this.contactsService.onContactsChanged.subscribe(function (contacts) {
                _this.jobs = contacts;
                _this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.id] = false;
                // });
            });
        this.onSelectedContactsChangedSubscription =
            this.contactsService.onSelectedContactsChanged.subscribe(function (selectedContacts) {
                // for ( const id in this.checkboxes )
                // {
                //     this.checkboxes[id] = selectedContacts.includes(id);
                // }
                // this.selectedContacts = selectedContacts;
            });
        this.onUserDataChangedSubscription =
            this.contactsService.onUserDataChanged.subscribe(function (user) {
                _this.user = user;
            });
    }
    JobsListComponent.prototype.ngOnInit = function () {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        this.dataSource = new FilesDataSource(this.contactsService, this.paginator, this.sort);
    };
    JobsListComponent.prototype.ngOnDestroy = function () {
        this.onContactsChangedSubscription.unsubscribe();
        this.onSelectedContactsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    };
    JobsListComponent.prototype.editJob = function (job) {
        this.contactsService.action = 'edit';
        this.contactsService.editJobs = job;
        //console.log( this.contactsService.editJobs.jobassignmentid)
        this.contactsService.getJobStatus(this.contactsService.editJobs.jobassignmentid);
        this.contactsService.getJobStatusHistory(this.contactsService.editJobs.jobassignmentid);
        //console.log(job);
        this.router.navigateByUrl('/jobsform');
        // this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data      : {
        //         contact: contact,
        //         action : 'edit'
        //     }
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         if ( !response )
        //         {
        //             return;
        //         }
        //         const actionType: string = response[0];
        //         const formData: FormGroup = response[1];
        //         switch ( actionType )
        //         {
        //             /**
        //              * Save
        //              */
        //             case 'save':
        //                 this.contactsService.updateContact(formData.getRawValue());
        //                 break;
        //             /**
        //              * Delete
        //              */
        //             case 'delete':
        //                 this.deleteContact(contact);
        //                 break;
        //         }
        //     });
    };
    /**
     * Delete Contact
     */
    JobsListComponent.prototype.deleteContact = function (contact) {
        var _this = this;
        this.confirmDialogRef = this.dialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.contactsService.deleteContact(contact);
            }
            _this.confirmDialogRef = null;
        });
    };
    JobsListComponent.prototype.onSelectedChange = function (contactId) {
        this.contactsService.toggleSelectedContact(contactId);
    };
    JobsListComponent.prototype.toggleStar = function (contactId) {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else {
            this.user.starred.push(contactId);
        }
        this.contactsService.updateUserData(this.user);
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobsListComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobsListComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobsListComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobsListComponent.prototype, "sort", void 0);
    JobsListComponent = __decorate([
        core_1.Component({
            selector: 'jobs-list',
            templateUrl: './jobs-list.component.html',
            styleUrls: ['./jobs-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsListComponent);
    return JobsListComponent;
}());
exports.JobsListComponent = JobsListComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(contactsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.contactsService = contactsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.contactsService.jobs;
        return _this;
    }
    Object.defineProperty(FilesDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    FilesDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
            this.contactsService.onContactsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.contactsService.jobs.slice();
            data = _this.filterData(data);
            _this.filteredData = data.slice();
            data = _this.sortData(data);
            // Grab the page's slice of data.
            var startIndex = _this._paginator.pageIndex * _this._paginator.pageSize;
            return data.splice(startIndex, _this._paginator.pageSize);
        });
    };
    FilesDataSource.prototype.filterData = function (data) {
        if (!this.filter) {
            return data;
        }
        return fuseUtils_1.FuseUtils.filterArrayByString(data, this.filter);
    };
    FilesDataSource.prototype.sortData = function (data) {
        var _this = this;
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }
        //displayedColumns = ['checkbox', 'title', 'publisheddate', 'name', 'priority', 'status', 'description', 'expirydate', 'isactive', 'createdby', 'createdon', 'modifiedby', 'modifiedon'];
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'jl_title':
                    _a = [a.title, b.title], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'jl_publisheddate':
                    _b = [a.publisheddate, b.publisheddate], propertyA = _b[0], propertyB = _b[1];
                    break;
                // case 'name':
                //     [propertyA, propertyB] = [a.name, b.name];
                //     break;
                case 'jl_userlist':
                    _c = [a.userlist, b.userlist], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'jl_priority':
                    _d = [a.priority, b.priority], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'jl_status':
                    _e = [a.status, b.status], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'jl_description':
                    _f = [a.modifiedon, b.modifiedon], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'jl_expirydate':
                    _g = [a.expirydate, b.expirydate], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'jl_isactive':
                    _h = [a.isactive, b.isactive], propertyA = _h[0], propertyB = _h[1];
                    break;
                case 'jl_createdby':
                    _j = [a.createdby, b.createdby], propertyA = _j[0], propertyB = _j[1];
                    break;
                case 'jl_createdon':
                    _k = [a.createdon, b.createdon], propertyA = _k[0], propertyB = _k[1];
                    break;
                case 'jl_modifiedby':
                    _l = [a.modifiedby, b.modifiedby], propertyA = _l[0], propertyB = _l[1];
                    break;
                case 'jl_modifiedon':
                    _m = [a.modifiedon, b.modifiedon], propertyA = _m[0], propertyB = _m[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        });
    };
    FilesDataSource.prototype.disconnect = function () {
    };
    return FilesDataSource;
}(collections_1.DataSource));
exports.FilesDataSource = FilesDataSource;
