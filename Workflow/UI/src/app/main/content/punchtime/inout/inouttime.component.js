"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var punchtime_model_1 = require("../punchtime.model");
var InOutTimeComponent = /** @class */ (function () {
    function InOutTimeComponent(punchTimeService, dialog, router, loginService, snackComp, utilities) {
        this.punchTimeService = punchTimeService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.isFormExpanded = true;
        this.isSavable = false;
        this.isOutTimeDisabled = true;
        this.isToday_Present = false;
        this.displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime', 'pt_hourday', 'pt_totalhourday', 'pt_isabsent'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.hoursWorked = 0;
        /* 12 hour format */
        this.times = ['12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '01:00 AM', '01:15 AM', '01:30 AM', '01:45 AM', '02:00 AM', '02:15 AM', '02:30 AM', '02:45 AM',
            '03:00 AM', '03:15 AM', '03:30 AM', '03:45 AM', '04:00 AM', '04:15 AM', '04:30 AM', '04:45 AM', '05:00 AM', '05:15 AM', '05:30 AM', '05:45 AM', '06:00 AM', '06:15 AM', '06:30 AM', '06:45 AM',
            '07:00 AM', '07:15 AM', '07:30 AM', '07:45 AM', '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM', '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
            '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
            '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
            '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM', '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM', '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM', '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM',
            '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM', '08:00 PM', '08:15 PM', '08:30 PM', '08:45 PM', '09:00 PM', '09:15 PM', '09:30 PM', '09:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM',
            '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM'];
        /* 24 hour format */
        ////times: string[] = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45'
        ////    , '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45'
        ////    , '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'
        ////    , '11:00', '11:15', '11:30', '11:45'
        ////    , '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45'
        ////    , '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45'
        ////    , '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45'
        ////    , '23:00', '23:15', '23:30', '23:45'];
        this.isGridView = true;
        this.searchInput = new forms_1.FormControl('');
    }
    InOutTimeComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new material_1.MatTableDataSource(this.myPunchDetails);
        this.myPunchDetail = new punchtime_model_1.InOutTime({});
        this.initializeData();
    };
    InOutTimeComponent.prototype.ngOnDestroy = function () {
    };
    InOutTimeComponent.prototype.ngAfterViewInit = function () {
        //this.dataSource.sort = this.sort;
    };
    InOutTimeComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    InOutTimeComponent.prototype.initializeData = function () {
        if (this.punchTimeService.myPunchDetails == undefined || this.punchTimeService.myPunchDetails.length == 0)
            this.refresh();
        else {
            this.myPunchDetails = this.punchTimeService.myPunchDetails;
            this._initializeDataAfterServiceCall();
            this.clearForm();
        }
    };
    InOutTimeComponent.prototype.refresh = function () {
        this._getMyPunchDetails();
        this.clearForm();
    };
    InOutTimeComponent.prototype.clearForm = function () {
        this.myPunchDetail = new punchtime_model_1.InOutTime({});
        this.inTime = null;
        this.outTime = null;
        this.hoursWorked = 0;
        this.myPunchDetail.intime = null;
        this.myPunchDetail.outtime = null;
        this._validateForm();
    };
    InOutTimeComponent.prototype.selectedItem = function (myPunchDetail) {
        this.isFormExpanded = true;
        this.myPunchDetail = myPunchDetail;
        this._bindData();
    };
    InOutTimeComponent.prototype.onInTimeChanged = function (time) {
        this.myPunchDetail.intime = this._setDateTimeAfterTimeSelected(time, this.myPunchDetail.isnextdayin, 'in');
        this._calculateHoursWorked();
        this._validateForm();
    };
    InOutTimeComponent.prototype.onOutTimeChanged = function (time) {
        this.myPunchDetail.outtime = this._setDateTimeAfterTimeSelected(time, this.myPunchDetail.isnextdayout, 'out');
        this._calculateHoursWorked();
        this._validateForm();
    };
    InOutTimeComponent.prototype.inNextDay = function () {
        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined) {
            this.myPunchDetail.intime = this._setDateTimeAfterTimeSelected(this.inTime, this.myPunchDetail.isnextdayin, 'in');
        }
        this._calculateHoursWorked();
        this._validateForm();
    };
    InOutTimeComponent.prototype.outNextDay = function () {
        if (this.myPunchDetail.outtime != null && this.myPunchDetail.outtime != undefined) {
            this.myPunchDetail.outtime = this._setDateTimeAfterTimeSelected(this.outTime, this.myPunchDetail.isnextdayout, 'out');
        }
        this._calculateHoursWorked();
        this._validateForm();
    };
    InOutTimeComponent.prototype.saveTime = function () {
        var _this = this;
        this.progressbar.showProgress();
        var timeToSave = new punchtime_model_1.InOutTime(this.myPunchDetail);
        var additionalTime = ':00.0000000 +00:00';
        timeToSave.intime = this.myPunchDetail.intime;
        timeToSave.outtime = this.myPunchDetail.outtime;
        if (timeToSave.intime != null && timeToSave.intime.length > 0) {
            var day = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd ');
            var inTime = this.datePipe.transform(timeToSave.intime, 'HH:mm aa');
            var actualTime = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd HH:mm:ss');
            var hour = parseInt(inTime.substr(0, 2));
            var min = parseInt(inTime.substr(3, 2));
            var ampm = inTime.substr(inTime.length - 2, 2);
            var hourString = '', minString = '';
            if ((hour == 12 || hour == 0) && ampm == 'AM') {
                hourString = '00';
            }
            else if (hour < 12 && ampm == 'PM') {
                hour += 12;
                hourString = hour.toString();
            }
            else {
                hourString = hour.toString();
            }
            if (hourString.length == 1) {
                hourString = '0' + hourString;
            }
            minString = min.toString();
            if (minString.length == 1) {
                minString = '0' + minString;
            }
            day += hourString + ':' + minString + additionalTime;
            timeToSave.intime = day;
        }
        if (timeToSave.outtime != null && timeToSave.outtime.length > 0) {
            var day = this.datePipe.transform(timeToSave.outtime, 'yyyy-MM-dd ');
            var outtime = this.datePipe.transform(timeToSave.outtime, 'HH:mm aa');
            var actualTime = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd HH:mm:ss');
            var hour = parseInt(outtime.substr(0, 2));
            var min = parseInt(outtime.substr(3, 2));
            var ampm = outtime.substr(outtime.length - 2, 2);
            var hourString = '', minString = '';
            if ((hour == 12 || hour == 0) && ampm == 'AM') {
                hourString = '00';
            }
            else if (hour < 12 && ampm == 'PM') {
                hour += 12;
                hourString = hour.toString();
            }
            else {
                hourString = hour.toString();
            }
            if (hourString.length == 1) {
                hourString = '0' + hourString;
            }
            minString = min.toString();
            if (minString.length == 1) {
                minString = '0' + minString;
            }
            day += hourString + ':' + minString + additionalTime;
            timeToSave.outtime = day;
        }
        this.punchTimeService.saveMyPunchDetails(timeToSave).then(function (response) {
            if (response) {
                if (response["ResultStatus"] == "1") {
                    _this.refresh();
                }
                _this.progressbar.hideProgress();
                _this.snackComp.showSnackBarPost(response, '');
            }
        });
    };
    InOutTimeComponent.prototype._setDateTimeAfterTimeSelected = function (time, isNextDayChecked, nextDayChecked) {
        var dat = new Date(this.myPunchDetail.punchday);
        if (isNextDayChecked && nextDayChecked == 'in') {
            if (this.myPunchDetail.isnextdayin) {
                dat.setDate(dat.getDate() + 1);
            }
        }
        else if (isNextDayChecked && nextDayChecked == 'out') {
            if (this.myPunchDetail.isnextdayout) {
                dat.setDate(dat.getDate() + 1);
            }
        }
        var time2 = time.value == undefined ? time : time.value;
        var hour = parseInt(time2.substr(0, 2));
        var min = parseInt(time2.substr(3, 2));
        var ampm = time2.substr(6, 2);
        return this.datePipe.transform(dat.setHours(hour, min, 0), 'MM-dd-yyyy HH:mm') + ' ' + ampm;
    };
    InOutTimeComponent.prototype._get24HourFormat = function (time) {
        if (time.toString().indexOf("PM") >= 0) {
            return parseInt(time.substr(0, 2)) + 12;
        }
        return parseInt(time.substr(0, 2));
    };
    InOutTimeComponent.prototype._initializeDataAfterServiceCall = function () {
        var _this = this;
        this.myPunchDetail = new punchtime_model_1.InOutTime({});
        this.myPunchDetails.map(function (x) {
            x.punchday = _this.datePipe.transform(x.punchday, 'MM-dd-yyyy');
            if (x.intime != null && x.intime != undefined) {
                var intimeampm = '';
                var hour = 0;
                if (x.intime.indexOf('T') > 0)
                    hour = parseInt(x.intime.substr(x.intime.indexOf('T') + 1, 2));
                else
                    hour = parseInt(x.intime.substr(x.intime.indexOf(' ') + 1, 2));
                if (x.intime.indexOf('PM') > 0)
                    intimeampm = 'PM';
                else if (x.intime.indexOf('AM') > 0)
                    intimeampm = 'AM';
                else if (hour >= 12)
                    intimeampm = 'PM';
                else
                    intimeampm = 'AM';
                if (x.intime.indexOf('T') > 0) {
                    var newDate = x.intime.substr(0, x.intime.indexOf('T'));
                    var newTime = x.intime.substr(x.intime.indexOf('T') + 1, 5);
                    var day = _this.datePipe.transform(newDate, 'MM-dd-yyyy');
                    x.intime = _this.utilities.Get12HourFormat(day, newTime, intimeampm);
                }
            }
            if (x.outtime != null && x.outtime != undefined) {
                var outtimeampm = '';
                var hour = 0;
                if (x.outtime.indexOf('T') > 0)
                    hour = parseInt(x.outtime.substr(x.outtime.indexOf('T') + 1, 2));
                else
                    hour = parseInt(x.outtime.substr(x.outtime.indexOf(' ') + 1, 2));
                if (x.outtime.indexOf('PM') > 0)
                    intimeampm = 'PM';
                else if (x.outtime.indexOf('AM') > 0)
                    intimeampm = 'AM';
                else if (hour >= 12)
                    outtimeampm = 'PM';
                else
                    outtimeampm = 'AM';
                if (x.outtime.indexOf('T') > 0) {
                    var newDate = x.outtime.substr(0, x.outtime.indexOf('T'));
                    var newTime = x.outtime.substr(x.outtime.indexOf('T') + 1, 5);
                    var day = _this.datePipe.transform(newDate, 'MM-dd-yyyy');
                    x.outtime = _this.utilities.Get12HourFormat(day, newTime, outtimeampm);
                }
            }
        });
        this.dataSource = new material_1.MatTableDataSource(this.myPunchDetails);
        this._bindData();
    };
    /* Select a record in the grid to populate in the form. */
    InOutTimeComponent.prototype._bindData = function () {
        this.myPunchDetail.punchday = this.datePipe.transform(this.myPunchDetail.punchday, 'MM-dd-yyyy');
        if (this.myPunchDetail.punchday == null)
            return;
        if (this.myPunchDetail.istoday && !this.myPunchDetail.isabsent)
            this.isToday_Present = true;
        else
            this.isToday_Present = false;
        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined) {
            var diff = (new Date(this.myPunchDetail.intime).valueOf() - new Date(this.myPunchDetail.punchday).valueOf());
            if (diff / (1000 * 3600 * 24) >= 1) {
                this.myPunchDetail.isnextdayin = true;
            }
            else {
                this.myPunchDetail.isnextdayin = false;
            }
            this.inTime = this.datePipe.transform(this.myPunchDetail.intime, 'HH:mm aa');
            var hour = parseInt(this.inTime.substr(0, 2));
            var ampm = this.inTime.substr(this.inTime.length - 2, 2);
            if (hour > 12) {
                if ((hour - 12).toString().length == 1)
                    this.inTime = "0" + (hour - 12) + this.inTime.substr(2);
                else
                    this.inTime = hour - 12 + this.inTime.substr(2);
            }
            else if (hour == 0) {
                this.inTime = 12 + this.inTime.substr(2);
            }
        }
        else {
            this.inTime = null;
        }
        if (this.myPunchDetail.outtime != null || this.myPunchDetail.outtime != undefined) {
            var diff = (new Date(this.myPunchDetail.outtime).valueOf() - new Date(this.myPunchDetail.punchday).valueOf());
            if (diff / (1000 * 3600 * 24) >= 1) {
                this.myPunchDetail.isnextdayout = true;
            }
            else {
                this.myPunchDetail.isnextdayout = false;
            }
            this.outTime = this.datePipe.transform(this.myPunchDetail.outtime, 'HH:mm aa');
            var hour = parseInt(this.outTime.substr(0, 2));
            var ampm = this.inTime.substr(this.outTime.length - 2, 2);
            if (hour > 12) {
                if ((hour - 12).toString().length == 1)
                    this.outTime = "0" + (hour - 12) + this.outTime.substr(2);
                else
                    this.outTime = hour - 12 + this.outTime.substr(2);
            }
            else if (hour == 0) {
                this.outTime = 12 + this.outTime.substr(2);
            }
        }
        else {
            this.outTime = null;
        }
        this._calculateHoursWorked();
        this._validateForm();
    };
    InOutTimeComponent.prototype._calculateHoursWorked = function () {
        if ((this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined && this.myPunchDetail.intime.length > 0)
            && (this.myPunchDetail.outtime != null && this.myPunchDetail.outtime != undefined && this.myPunchDetail.outtime.length > 0)) {
            var out = new Date(this.myPunchDetail.outtime);
            var inT = new Date(this.myPunchDetail.intime);
            this.hoursWorked = (out.getTime() - inT.getTime()) / (3600 * 1000);
        }
        else {
            this.hoursWorked = 0;
        }
    };
    InOutTimeComponent.prototype._validateForm = function () {
        if (this.myPunchDetail.punchday.length > 0 && !this.myPunchDetail.isapproved && this.myPunchDetail.intime != null && this.hoursWorked >= 0)
            this.isSavable = true;
        else
            this.isSavable = false;
        if (this.myPunchDetail.intime != null)
            this.isOutTimeDisabled = false;
        else
            this.isOutTimeDisabled = true;
    };
    InOutTimeComponent.prototype._getMyPunchDetails = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.punchTimeService.getMyPunchDetails().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.myPunchDetails = _this.punchTimeService.myPunchDetails;
                //this.dataSource = new MatTableDataSource(this.myPunchDetails);
                _this._initializeDataAfterServiceCall();
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], InOutTimeComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], InOutTimeComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], InOutTimeComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], InOutTimeComponent.prototype, "sort", void 0);
    InOutTimeComponent = __decorate([
        core_1.Component({
            selector: 'punching',
            templateUrl: './inouttime.component.html',
            styleUrls: ['../punchtime.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], InOutTimeComponent);
    return InOutTimeComponent;
}());
exports.InOutTimeComponent = InOutTimeComponent;
