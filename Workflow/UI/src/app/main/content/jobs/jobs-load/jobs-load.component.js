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
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var collections_1 = require("@angular/cdk/collections");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var jobs_model_1 = require("../jobs.model");
var dialog_component_1 = require("../../dialog/dialog.component");
var JobsLoadComponent = /** @class */ (function () {
    function JobsLoadComponent(jobsService, dialog, router, loginService, userService, snackComp, utilities) {
        var _this = this;
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.userService = userService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['jn_referenceid', 'jn_title', 'jn_location', 'jn_clientname', 'jn_publisheddate', 'jn_priorityid', 'jn_userlist', 'jn_selectedUser', 'jn_buttons'];
        this.usersList = [];
        this.priorityList = [];
        this.clientList = [];
        this.savableJobs = Array();
        this.savableJobAssignments = Array();
        this.dropdownSettings = {};
        this.isAllJobsValid = false;
        this.searchInput = new forms_1.FormControl('');
        this.onNewJobsChangedSubscription =
            this.jobsService.newJobsChanged.subscribe(function (contacts) {
                _this.newJobs = contacts;
            });
        this.onSelectedNewJobsChangedSubscription =
            this.jobsService.onSelectedNewJobsChanged.subscribe(function (selectedContacts) {
            });
        this.onUserDataChangedSubscription =
            this.jobsService.onUserDataChanged.subscribe(function (user) {
                _this.user = user;
            });
    }
    JobsLoadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbarConfig = new app_model_1.ProgressBarConfig({});
        this.loggedUserId = this.jobsService.getLoginId();
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
        this.getAssignmentUserList();
        if (this.priorityList.length == 0)
            this.getPriorityList();
        this.getClientList();
        this.dropdownSettings = {
            singleSelection: false,
            text: "Recruiters",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            badgeShowLimit: 2
        };
    };
    JobsLoadComponent.prototype.ngOnDestroy = function () {
        this.onNewJobsChangedSubscription.unsubscribe();
        this.onSelectedNewJobsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    };
    JobsLoadComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    JobsLoadComponent.prototype.synchJobs = function () {
        var _this = this;
        this.showHideProgressBar(true);
        this.jobsService.synchJobs()
            .then(function (response) {
            if (response["Result"] == "1") {
                _this.jobsService.getNewJobs(true)
                    .then(function (result) {
                    _this.showHideProgressBar(false);
                    _this.snackComp.showSimpleSnackBar(response["Message"]);
                });
            }
            else {
                _this.showHideProgressBar(false);
                _this.snackComp.showSimpleSnackBar(response["Message"]);
            }
        });
    };
    JobsLoadComponent.prototype.prioritizeJob = function () {
        this.router.navigateByUrl('prioritizejob');
    };
    JobsLoadComponent.prototype.onClientChanged = function (event, editJob) {
        editJob.clientname = event.value;
        this.isAllJobsValid = this.isValidJob(editJob);
    };
    JobsLoadComponent.prototype.onPriorityChanged = function (event, editJob) {
        editJob.priorityLevel = event.value;
        this.isAllJobsValid = this.isValidJob(editJob);
    };
    JobsLoadComponent.prototype.openAssignToModal = function (editJob, userlist, selectedusers) {
        var _this = this;
        userlist = this.mapOrder(userlist, selectedusers, "id");
        var dialogUserList = this.dialog.open(dialog_component_1.DialogDataComponent, {
            height: "550px",
            width: "400px",
            data: {
                title: 'Assign To',
                userList: userlist,
                selectedUsers: selectedusers,
                groupByField: 'roleName'
            }
        });
        dialogUserList.afterClosed().subscribe(function (result) {
            if (result == undefined) {
                editJob.isValid = false;
                editJob.selectedUser = [];
                editJob.oldSelectedUser.forEach(function (sel) {
                    editJob.selectedUser.push(sel);
                });
            }
            else {
                _this.isAllJobsValid = _this.isValidJob(editJob);
            }
        });
    };
    JobsLoadComponent.prototype.saveJob = function (editJob) {
        var _this = this;
        var userid = editJob.selectedUser.map(function (user) {
            return (user["id"]);
        });
        this.jobAssign = new jobs_model_1.JobAssignment({});
        this.jobAssign.userids = userid;
        this.jobAssign.clientname = editJob.clientname;
        this.jobAssign.jobid = editJob.jobid;
        this.jobAssign.priorityid = editJob.priorityLevel;
        this.jobAssign.loginid = this.loggedUserId;
        this.showHideProgressBar(true);
        this.jobsService.saveJobAssignment(this.jobAssign)
            .then(function (response) {
            editJob.isValid = false;
            _this.isAllJobsValid = false;
            _this.showHideProgressBar(false);
            _this.getAssignmentUserList();
            _this.snackComp.showSnackBarPost(response, '');
        });
    };
    JobsLoadComponent.prototype.saveJobs = function () {
        var _this = this;
        if (this.savableJobs.length > 0) {
            /* Clear all the previos jobs. */
            this.savableJobAssignments = [];
            this.savableJobs.forEach(function (job) {
                var userid = job.selectedUser.map(function (user) { return (user["id"]); });
                var jobAssignment = new jobs_model_1.JobAssignment({});
                jobAssignment.jobid = job.jobid;
                jobAssignment.userids = userid;
                jobAssignment.clientname = job.clientname;
                jobAssignment.priorityid = job.priorityLevel;
                jobAssignment.loginid = _this.loggedUserId;
                _this.savableJobAssignments.push(jobAssignment);
            });
            this.showHideProgressBar(true);
            this.jobsService.saveJobsAssignment(this.savableJobAssignments)
                .then(function (response) {
                _this.isAllJobsValid = false;
                _this.showHideProgressBar(false);
                _this.getAssignmentUserList();
                _this.snackComp.showSnackBarPost(response, '');
                if (response["ResultStatus"] == "1") {
                    _this.savableJobs = [];
                }
            });
        }
    };
    JobsLoadComponent.prototype.getAssignmentUserList = function () {
        var _this = this;
        this.showHideProgressBar(true);
        this.usersList = [];
        this.userService.getAssignedUser(1).then(function (response) {
            if (response) {
                _this.showHideProgressBar(false);
                response.map(function (user) {
                    _this.usersList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                });
            }
        });
    };
    JobsLoadComponent.prototype.getPriorityList = function () {
        var _this = this;
        this.jobsService.getPriority().then(function (response) {
            if (response) {
                response.map(function (priority) {
                    _this.priorityList.push({ "id": priority["priorityid"], "itemName": priority["name"] });
                });
            }
        });
    };
    JobsLoadComponent.prototype.getClientList = function () {
        var _this = this;
        this.clientList = [];
        this.jobsService.getClients().then(function (response) {
            if (response) {
                response.map(function (client) {
                    _this.clientList.push({ "id": client["id"], "clientname": client["clientname"] });
                });
            }
        });
    };
    JobsLoadComponent.prototype.showHideProgressBar = function (isVisible) {
        this.progressbarConfig.isVisible = isVisible;
    };
    JobsLoadComponent.prototype.mapOrder = function (array, order, key) {
        var _this = this;
        var recruiter = [], leader = [], recruiterSel = [], leaderSel = [];
        array.filter(function (x) {
            if (x.roleName.toLowerCase() === _this.utilities.rn_recruiter.toLocaleLowerCase())
                recruiter.push(x);
        });
        array.filter(function (x) {
            if (x.roleName.toLowerCase() === _this.utilities.rn_teamlead.toLocaleLowerCase())
                leader.push(x);
        });
        order.forEach(function (item) {
            recruiter.filter(function (x) {
                if (x.id === item.id)
                    recruiterSel.push(x);
            });
        });
        order.forEach(function (item) {
            leader.filter(function (x) {
                if (x.id === item.id)
                    leaderSel.push(x);
            });
        });
        recruiterSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return 1;
            }
            if (x > y) {
                return -1;
            }
            return 0;
        });
        leaderSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return 1;
            }
            if (x > y) {
                return -1;
            }
            return 0;
        });
        recruiter.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        leader.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        recruiterSel.forEach(function (sel) {
            var user = recruiter.filter(function (item) { return item.id == sel.id; });
            var index = recruiter.indexOf(user[0]);
            recruiter.splice(index, 1);
            recruiter.splice(0, 0, user[0]);
        });
        leaderSel.forEach(function (sel) {
            var user = leader.filter(function (item) { return item.id == sel.id; });
            var index = leader.indexOf(user[0]);
            leader.splice(index, 1);
            leader.splice(0, 0, user[0]);
        });
        var result = recruiter.concat(leader);
        return result;
    };
    ;
    JobsLoadComponent.prototype.isValidJob = function (job) {
        if (job.clientname == "" || job.clientname == undefined || job.priorityLevel == "" || job.priorityLevel == undefined) {
            job.isValid = false;
        }
        if (job.priorityLevel != "" && job.clientname != "" && (job.priorityLevel != job.oldPriorityLevel || job.clientname != job.oldclientname || JSON.stringify(job.selectedUser) != JSON.stringify(job.oldSelectedUser))) {
            for (var i = this.savableJobs.length - 1; i >= 0; i--) {
                if (this.savableJobs[i].jobid == job.jobid) {
                    this.savableJobs.splice(i, 1);
                    break;
                }
            }
            this.savableJobs.push(job);
            job.isValid = true;
        }
        else {
            for (var i = this.savableJobs.length - 1; i >= 0; i--) {
                if (this.savableJobs[i].jobid == job.jobid) {
                    this.savableJobs.splice(i, 1);
                    break;
                }
            }
            job.isValid = false;
        }
        if (this.savableJobs.length > 0)
            return true;
        return false;
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
            selector: 'jobs',
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
