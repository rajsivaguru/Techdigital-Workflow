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
        //displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime', 'pt_buttons'];
        this.displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.hoursWorked = 0;
        this.hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        this.minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
            '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55',
            '56', '57', '58', '59'];
        this.isGridView = true;
        this.searchInput = new forms_1.FormControl('');
    }
    InOutTimeComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new material_1.MatTableDataSource(this.myPunchDetails);
        this.myPunchDetail = new punchtime_model_1.InOutTime({});
        this.todayPunchDetail = new punchtime_model_1.InOutTime({});
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
        }
    };
    InOutTimeComponent.prototype.refresh = function () {
        this._getMyPunchDetails();
    };
    InOutTimeComponent.prototype.clearForm = function () {
        //var currentDateTime = new Date();
        //if (this.myPunchDetail.punchid == null || this.myPunchDetail.punchid == undefined)
        //{
        //    this.inHour = currentDateTime.getHours().toString();
        //    this.inMinute = currentDateTime.getMinutes().toString();
        //}
        this._calculateTime();
    };
    InOutTimeComponent.prototype.selectedItem = function (myPunchDetail) {
        this.isFormExpanded = true;
        this.myPunchDetail = myPunchDetail;
        this._calculateTime();
    };
    InOutTimeComponent.prototype._initializeDataAfterServiceCall = function () {
        var _this = this;
        var todayData = this.myPunchDetails.filter(function (x) {
            if (x.istoday)
                return x;
        });
        if (todayData != null && todayData != undefined && todayData.length > 0) {
            this.myPunchDetail = todayData[0];
            this.todayPunchDetail = todayData[0];
            ////this.maxDate = this.myPunchDetail.punchday;
        }
        else
            this.myPunchDetail = new punchtime_model_1.InOutTime({});
        this.myPunchDetails.map(function (x) {
            x.punchday = _this.datePipe.transform(x.punchday, 'MM-dd-yyyy');
        });
        this.dataSource = new material_1.MatTableDataSource(this.myPunchDetails);
        this._calculateTime();
    };
    InOutTimeComponent.prototype._calculateTime = function () {
        var currentDateTime = new Date();
        this.currentDate = this.datePipe.transform(currentDateTime, 'MM-dd-yyyy hh:mm aa');
        this.myPunchDetail.punchday = this.datePipe.transform(this.myPunchDetail.punchday, 'MM-dd-yyyy');
        if (this.myPunchDetail.punchid == null || this.myPunchDetail.punchid == undefined || this.myPunchDetail.punchid == 0) {
            this.inHour = currentDateTime.getHours().toString();
            this.inMinute = currentDateTime.getMinutes().toString();
            this.outHour = '';
            this.outMinute = '';
        }
        else {
            this.outHour = currentDateTime.getHours().toString();
            this.outMinute = currentDateTime.getMinutes().toString();
        }
        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined) {
            this.inHour = this.datePipe.transform(this.myPunchDetail.intime, 'hh');
            this.inMinute = this.datePipe.transform(this.myPunchDetail.intime, 'mm');
        }
        if (this.myPunchDetail.outtime != null || this.myPunchDetail.outtime != undefined) {
            this.outHour = this.datePipe.transform(this.myPunchDetail.outtime, 'hh');
            this.outMinute = this.datePipe.transform(this.myPunchDetail.outtime, 'mm');
        }
        this._validateForm();
    };
    InOutTimeComponent.prototype._validateForm = function () {
        if (new Date(this.myPunchDetail.punchday) <= new Date(this.todayPunchDetail.punchday))
            this.isSavable = true;
        else
            this.isSavable = false;
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
