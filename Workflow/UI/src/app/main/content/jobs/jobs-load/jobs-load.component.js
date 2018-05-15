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
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var confirm_dialog_component_1 = require("../../../../core/components/confirm-dialog/confirm-dialog.component");
var collections_1 = require("@angular/cdk/collections");
var animations_1 = require("../../../../core/animations");
var jobs_model_1 = require("../jobs.model");
var dialog_component_1 = require("../../dialog/dialog.component");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var JobsLoadComponent = /** @class */ (function () {
    function JobsLoadComponent(jobsService, dialog, snackBar, router, loginService, userService) {
        var _this = this;
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.router = router;
        this.loginService = loginService;
        this.userService = userService;
        this.displayedColumns = ['jn_referenceid', 'jn_title', 'jn_location', 'jn_clientname', 'jn_publisheddate', 'jn_priorityid', 'jn_userlist', 'jn_selectedUser', 'jn_buttons'];
        this.usersList = [];
        this.priorityList = [];
        this.clientList = [];
        this.dropdownSettings = {};
        this.dropdownPrioritySettings = {};
        this.myControl = new forms_1.FormControl();
        this.searchInput = new forms_1.FormControl('');
        this.onNewJobsChangedSubscription =
            this.jobsService.newJobsChanged.subscribe(function (contacts) {
                _this.newJobs = contacts;
                _this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.id] = false;
                // });
            });
        this.onSelectedNewJobsChangedSubscription =
            this.jobsService.onSelectedNewJobsChanged.subscribe(function (selectedContacts) {
                // for ( const id in this.checkboxes )
                // {
                //     this.checkboxes[id] = selectedContacts.includes(id);
                // }
                // this.selectedContacts = selectedContacts;
            });
        this.onUserDataChangedSubscription =
            this.jobsService.onUserDataChanged.subscribe(function (user) {
                _this.user = user;
            });
    }
    JobsLoadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataSource = new FilesDataSource(this.jobsService, this.paginator, this.sort);
        this.jobsService.onSelectedNewJobsChanged
            .subscribe(function (selectedNewJobs) {
            _this.hasSelectedNewJobs = selectedNewJobs.length > 0;
        });
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.paginator.pageIndex = 0;
            _this.jobsService.onSearchNewJobsTextChanged.next(searchText);
        });
        this.userService.getAssignedUser(1).then(function (response) {
            if (response) {
                response.map(function (user) {
                    _this.usersList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                });
                //console.log(this.usersList);
            }
        });
        this.jobsService.getPriority().then(function (response) {
            if (response) {
                response.map(function (priori) {
                    _this.priorityList.push({ "id": priori["priorityid"], "itemName": priori["name"] });
                });
            }
        });
        // bind the clients
        this.bindClients();
        this.dropdownSettings = {
            singleSelection: false,
            text: "Recruiters",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            badgeShowLimit: 2
        };
    };
    JobsLoadComponent.prototype.bindClients = function () {
        var _this = this;
        this.clientList = [];
        this.jobsService.getClients().then(function (response) {
            if (response) {
                response.map(function (client) {
                    _this.clientList.push({ "clientname": client["clientname"] });
                });
                _this.filteredOptions = _this.myControl.valueChanges.startWith(null)
                    .map(function (val) { return val ? _this.filterClient(val) : _this.clientList.slice(); });
            }
        });
    };
    JobsLoadComponent.prototype.filterClient = function (val) {
        return this.clientList.filter(function (option) { return option.clientname.toLowerCase().indexOf(val.toLowerCase()) === 0; });
    };
    JobsLoadComponent.prototype.clientNameTyped = function (evet, editJobs) {
        editJobs.clientname = evet.target.value;
        if (editJobs.clientname == editJobs.oldclientname)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;
    };
    JobsLoadComponent.prototype.clientSelected = function (evet, editJobs) {
        var _this = this;
        editJobs.clientname = evet.option.value;
        if (editJobs.clientname == editJobs.oldclientname)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;
        this.filteredOptions = this.myControl.valueChanges
            .startWith(null)
            .map(function (val) { return val ? _this.filterClient(val) : _this.clientList.slice(); });
    };
    JobsLoadComponent.prototype.changePriorityLevel = function (event, editJobs) {
        editJobs.priorityLevel = event.value;
        if (editJobs.priorityLevel == editJobs.oldPriorityLevel)
            editJobs.isSaveEnable = false;
        else
            editJobs.isSaveEnable = true;
    };
    JobsLoadComponent.prototype.saveItemSelect = function (editJobs) {
        var _this = this;
        if (editJobs.clientname == "" || editJobs.clientname == undefined) {
            this.openDialog("Please enter the Client.");
            return;
        }
        var userid = editJobs.selectedUser.map(function (user) {
            return (user["id"]);
        });
        {
            this.jobAssign = new jobs_model_1.JobAssignment({});
            this.jobAssign.userids = userid;
            this.jobAssign.clientname = editJobs.clientname;
            this.jobAssign.jobid = editJobs.jobid;
            this.jobAssign.priorityid = editJobs.priorityLevel;
            this.jobsService.saveJobUser(this.jobAssign)
                .then(function (response) {
                editJobs.isSaveEnable = false;
                editJobs.isSaveEnableSelectedUser = false;
                if (response) {
                    _this.bindClients();
                    if (response["Result"] == "1") {
                        _this.openDialog(response["Message"]);
                    }
                    else {
                        _this.openDialog(response["Message"]);
                    }
                }
            });
        }
    };
    JobsLoadComponent.prototype.ngOnDestroy = function () {
        this.onNewJobsChangedSubscription.unsubscribe();
        this.onSelectedNewJobsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    };
    JobsLoadComponent.prototype.synchJobs = function () {
        var _this = this;
        this.jobsService.synchJobs()
            .then(function (response) {
            //console.log(response)
            if (response) {
                _this.jobsService.getNewJobs();
                if (response["Result"] == "1") {
                    //this.router.navigateByUrl('/jobs');
                    _this.openDialog(response["Message"]);
                }
                else {
                    _this.openDialog(response["Message"]);
                }
            }
        });
    };
    JobsLoadComponent.prototype.editJob = function (job) {
        this.jobsService.action = 'edit';
        this.jobsService.editJobs = job;
        //console.log( this.jobsService.editJobs.jobassignmentid)
        this.jobsService.getJobStatus(this.jobsService.editJobs.jobassignmentid);
        this.jobsService.getJobStatusHistory(this.jobsService.editJobs.jobassignmentid);
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
    JobsLoadComponent.prototype.deleteContact = function (contact) {
        var _this = this;
        this.confirmDialogRef = this.dialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.jobsService.deleteContact(contact);
            }
            _this.confirmDialogRef = null;
        });
    };
    JobsLoadComponent.prototype.onSelectedChange = function (contactId) {
        this.jobsService.toggleSelectedNewJob(contactId);
    };
    JobsLoadComponent.prototype.toggleStar = function (contactId) {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else {
            this.user.starred.push(contactId);
        }
        this.jobsService.updateUserData(this.user);
    };
    JobsLoadComponent.prototype.mapOrder = function (array, order, key) {
        array.sort(function (A, B) {
            var resultArray = order.filter(function (row) { return row.id === A[key]; });
            if (resultArray.length > 0)
                return -1;
            else
                return 1;
        });
        return array;
    };
    ;
    JobsLoadComponent.prototype.openUserDialog = function (editJobs, userlist, selectedusers) {
        userlist = this.mapOrder(userlist, selectedusers, "id");
        var dialogUserList = this.dialog.open(dialog_component_1.DialogDataComponent, {
            height: "550px",
            width: "400px",
            data: {
                userList: userlist,
                selectedUsers: selectedusers
            }
        });
        dialogUserList.afterClosed().subscribe(function (result) {
            if (result == undefined) {
                editJobs.selectedUser = editJobs.oldSelectedUser;
                editJobs.isSaveEnableSelectedUser = false;
            }
            else {
                if (JSON.stringify(editJobs.selectedUser) === JSON.stringify(editJobs.oldSelectedUser))
                    editJobs.isSaveEnableSelectedUser = false;
                else
                    editJobs.isSaveEnableSelectedUser = true;
            }
        });
    };
    JobsLoadComponent.prototype.openDialog = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-blue-100-bg']
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobsLoadComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobsLoadComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobsLoadComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobsLoadComponent.prototype, "sort", void 0);
    JobsLoadComponent = __decorate([
        core_1.Component({
            selector: 'jobs-load',
            templateUrl: './jobs-load.component.html',
            styleUrls: ['./jobs-load.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsLoadComponent);
    return JobsLoadComponent;
}());
exports.JobsLoadComponent = JobsLoadComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(jobsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.jobsService = jobsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.jobsService.newJobs;
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
        //console.log(this.jobsService.newJobsChanged)
        var displayDataChanges = [
            this.jobsService.newJobsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.jobsService.newJobs.slice();
            data = _this.filterData(data);
            _this.filteredData = data.slice();
            data = _this.sortData(data);
            if (_this.directiveScroll) {
                _this.directiveScroll.scrollToTop(0, 500);
                _this.directiveScroll.update();
            }
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
        //displayedColumns = ['title', 'location', 'description', 'publisheddate', 'referenceid', 'userlist', 'buttons'];
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'jn_referenceid':
                    _a = [a.referenceid, b.referenceid], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'jn_title':
                    _b = [a.title, b.title], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'jn_location':
                    _c = [a.location, b.location], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'jn_clientname':
                    _d = [a.clientname, b.clientname], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'jn_publisheddate':
                    _e = [a.publisheddate, b.publisheddate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'jn_priorityid':
                    _f = [a.priorityid, b.priorityid], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'jn_userlist':
                    _g = [a.userlist, b.userlist], propertyA = _g[0], propertyB = _g[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g;
        });
    };
    FilesDataSource.prototype.disconnect = function () {
    };
    __decorate([
        core_1.ViewChild(fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective)
    ], FilesDataSource.prototype, "directiveScroll", void 0);
    return FilesDataSource;
}(collections_1.DataSource));
exports.FilesDataSource = FilesDataSource;
