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
var animations_1 = require("../../../core/animations");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var confirm_dialog_component_1 = require("../../../core/components/confirm-dialog/confirm-dialog.component");
var collections_1 = require("@angular/cdk/collections");
var fuseUtils_1 = require("../../../core/fuseUtils");
var moment = require("moment");
require("rxjs/add/observable/interval");
var RecruitersComponent = /** @class */ (function () {
    //confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    function RecruitersComponent(recruiterService, jobsService, dialog, fuseConfig, snackBar, router, loginService) {
        this.recruiterService = recruiterService;
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.fuseConfig = fuseConfig;
        this.snackBar = snackBar;
        this.router = router;
        this.loginService = loginService;
        this.displayedColumns = ['r_referenceid', 'r_title', 'r_location', 'r_expirydate', 'r_priorityLevel', 'r_createdby', 'r_startbutton', 'r_stopbutton'];
        this.searchInput = new forms_1.FormControl('');
        this.jobDuration = this.fuseConfig.JobTimerDuration;
        this.alertDuration = this.fuseConfig.AlertTimerDuration;
    }
    RecruitersComponent.prototype.ngOnInit = function () {
        var _this = this;
        {
            this.dataSource = new FilesDataSource(this.recruiterService, this.paginator, this.sort);
            this.searchInput.valueChanges
                .debounceTime(300)
                .subscribe(function (searchText) {
                _this.paginator.pageIndex = 0;
                _this.recruiterService.onSearchTextChanged.next(searchText);
            });
        }
        if (this.jobDuration == undefined)
            this.jobDuration = 3600;
        if (this.alertDuration == undefined)
            this.alertDuration = 30;
    };
    RecruitersComponent.prototype.validateSubmission = function (event) {
        //console.log(event.value)
        return false;
    };
    RecruitersComponent.prototype.startJobTimer = function (recuriterJobs) {
        var _this = this;
        //console.log(recuriterJobs)
        var noOfJobs = [];
        this.recruiterService.recruiterJobs.map(function (job) {
            if (job.jobassignmentstatusid > 0 && job.endtime == '')
                noOfJobs.push(job.jobassignmentstatusid);
        });
        if (noOfJobs != undefined && noOfJobs.length >= 2) {
            this.openDialog('Maximum of 2 jobs only can be started at a time.');
        }
        else {
            this.recruiterService.startRecruiterJob(recuriterJobs.jobassignmentid).then(function (respone) {
                //this.jobStatus = respone
                _this.openDialog('Your job has been Started.');
                if (respone != null && respone != '' && respone != undefined) {
                    recuriterJobs.jobassignmentstatusid = respone[0]["Id"];
                    _this.jobTimerSubscribe(recuriterJobs);
                }
            });
        }
    };
    RecruitersComponent.prototype.jobTimerSubscribe = function (recuriterJobs) {
        var _this = this;
        recuriterJobs.countDown =
            Observable_1.Observable
                .interval(5000)
                .map(function (value) {
                return recuriterJobs.diff = recuriterJobs.diff + 5;
            })
                .map(function (value) {
                var timeLeft = moment.duration(value, 'seconds');
                return {
                    days: timeLeft.asDays().toFixed(0),
                    hours: timeLeft.hours(),
                    minutes: timeLeft.minutes(),
                    seconds: timeLeft.seconds()
                };
            });
        recuriterJobs.jobTimer = recuriterJobs.countDown.subscribe(function (value) {
            //console.log(value)
            recuriterJobs.countdown = value;
            if (recuriterJobs.countdown["seconds"] > _this.jobDuration) {
                recuriterJobs.jobTimer.unsubscribe();
                _this.openUserDialog(recuriterJobs);
            }
        });
    };
    RecruitersComponent.prototype.openUserDialog = function (recuriterJobs) {
        var _this = this;
        recuriterJobs.confirmDialogRef = this.dialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        recuriterJobs.confirmDialogRef.afterOpen().subscribe(function (result) {
            recuriterJobs.dialogDiff = 1;
            recuriterJobs.dialogCountDown = Observable_1.Observable.interval(5000).map(function (value) {
                return recuriterJobs.dialogDiff = recuriterJobs.dialogDiff + 5;
            });
            recuriterJobs.dialogTimer = recuriterJobs.dialogCountDown.subscribe(function (value) {
                //console.log(value)
                recuriterJobs.dialogCountDown = value;
                if (recuriterJobs.dialogCountDown > _this.alertDuration) {
                    recuriterJobs.dialogTimer.unsubscribe();
                    if (recuriterJobs.confirmDialogRef != null)
                        recuriterJobs.confirmDialogRef.close();
                }
            });
        });
        recuriterJobs.confirmDialogRef.componentInstance.jobCode = recuriterJobs.referenceid;
        recuriterJobs.confirmDialogRef.componentInstance.confirmMessage = 'Time Elapsed! Do you want to continue?';
        //this.confirmDialogRef.componentInstance.data = recuriterJobs;
        recuriterJobs.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (!result) {
                recuriterJobs.comment = "stopped";
                _this.stopJobTimer(recuriterJobs);
            }
            if (result) {
                recuriterJobs.diff = 1;
                _this.jobTimerSubscribe(recuriterJobs);
            }
            recuriterJobs.confirmDialogRef = null;
        });
    };
    RecruitersComponent.prototype.stopJobTimer = function (recuriterJobs) {
        var _this = this;
        // this.jobsService.getJobStatus(recuriterJobs.jobassignmentid).then (respone => {
        //     this.jobStatus = respone
        //     //console.log(this.jobStatus )
        // });
        //comment.checkValidity()
        //recuriterJobs.status = '0';
        if (recuriterJobs.comment == '') {
            this.openDialog('Please fill the Comment.');
        }
        else {
            this.recruiterService.stopRecruiterJob(recuriterJobs.jobassignmentid, recuriterJobs.jobassignmentstatusid, recuriterJobs.submission, recuriterJobs.comment).then(function (respone) {
                _this.openDialog('Your job has been Stopped.');
                recuriterJobs.dialogTimer.unsubscribe();
                recuriterJobs.jobTimer.unsubscribe();
            });
        }
    };
    RecruitersComponent.prototype.clearRecuriterStatus = function () {
    };
    RecruitersComponent.prototype.saveRecuriterStatus = function (recuriterJobs) {
        //console.log(recuriterJobs)
    };
    RecruitersComponent.prototype.ngOnDestroy = function () {
        //this.onRecruiterJobChangedSubscription.unsubscribe();
    };
    RecruitersComponent.prototype.openDialog = function (message) {
        // this.dialog.open(DialogComponent, {
        //     width: '450px',
        //     data: { message : message }
        //     });
        this.snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'top'
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], RecruitersComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], RecruitersComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], RecruitersComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], RecruitersComponent.prototype, "sort", void 0);
    __decorate([
        core_1.Input('eventDate')
    ], RecruitersComponent.prototype, "eventDate", void 0);
    RecruitersComponent = __decorate([
        core_1.Component({
            selector: 'fuse-recruiters',
            templateUrl: './recruiters.component.html',
            styleUrls: ['./recruiters.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], RecruitersComponent);
    return RecruitersComponent;
}());
exports.RecruitersComponent = RecruitersComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(recuriterService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.recuriterService = recuriterService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.recuriterService.recruiterJobs;
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
            this.recuriterService.onRecruiterJobChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.recuriterService.recruiterJobs.slice();
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
        //displayedColumns = ['r_referenceid', 'r_title', 'r_location', 'r_expirydate', 'r_priorityLevel', 'r_createdby', 'r_startbutton', 'r_stopbutton'];
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'r_referenceid':
                    _a = [a.referenceid, b.referenceid], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'r_title':
                    _b = [a.title, b.title], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'r_location':
                    _c = [a.location, b.location], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'r_expirydate':
                    _d = [a.expirydate, b.expirydate], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'r_priorityLevel':
                    _e = [a.priorityid, b.priorityid], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'r_createdby':
                    _f = [a.createdby, b.createdby], propertyA = _f[0], propertyB = _f[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f;
        });
    };
    FilesDataSource.prototype.disconnect = function () {
    };
    return FilesDataSource;
}(collections_1.DataSource));
exports.FilesDataSource = FilesDataSource;
