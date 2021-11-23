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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
////import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
////import { FuseUtils } from '../../../../core/fuseUtils';
////import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
var animations_1 = require("../../../core/animations");
var app_model_1 = require("../../../app.model");
var InOutTimeComponent = /** @class */ (function () {
    function InOutTimeComponent(punchTimeService, dialog, router, loginService, snackComp, utilities) {
        this.punchTimeService = punchTimeService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        //prioritizedJobs: PriorityJob[];
        //allJobs: PriorityJob[];
        //dataSource: MatTableDataSource<PriorityJob> | null;
        //dataSourcePriority: MatTableDataSource<PriorityJob> | null;
        this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_checkbox'];
        this.priorityColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_buttons'];
        this.jobPriorityChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.isFormExpanded = true;
        this.isSavable = false;
        this.isGridView = true;
        this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        this.minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
            '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55',
            '56', '57', '58', '59'];
        this.searchInput = new forms_1.FormControl('');
    }
    InOutTimeComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        var currentDateTime = new Date();
        var datePipe = new common_1.DatePipe("en-US");
        this.maxDate = currentDateTime;
        this.currentDate = datePipe.transform(currentDateTime, 'MM-dd-yyyy hh:mm aa');
        this.punchDate = datePipe.transform(currentDateTime, 'MM-dd-yyyy');
        this.inHour = currentDateTime.getHours().toString();
        this.inMinute = currentDateTime.getMinutes().toString();
        //this.outHour = 7;
        //this.outMinute = 45;
        //this.getAllJobs();
        //this.dataSource = new MatTableDataSource(this.allJobs);
        //this.getPrioritizedJobList();     
    };
    InOutTimeComponent.prototype.ngOnDestroy = function () {
    };
    InOutTimeComponent.prototype.ngAfterViewInit = function () {
        //this.dataSource.sort = this.sort;
    };
    InOutTimeComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    InOutTimeComponent.prototype.getAllJobs = function () {
        //let prioritizedJobIds = [];
        //this.allJobs = [];
        //if (this.prioritizedJobs == undefined)
        //    this.prioritizedJobs = [];
        //this.progressbar.showProgress();
        //this.prioritizedJobs.forEach(x => {
        //    prioritizedJobIds.push(x.jobid);
        //});
        //if (prioritizedJobIds.length > 0) {
        //    this.jobsService.newJobs.slice(0, 120).map(job => {
        //        let item = new PriorityJob(job);
        //        let index = prioritizedJobIds.indexOf(parseInt(job.jobid));
        //        if (index >= 0) {
        //            item.isprioritized = true;
        //        }
        //        this.allJobs.push(item);
        //    });
        //}
        //else
        //{
        //    this.jobsService.newJobs.slice(0, 120).map(job => {
        //        let item = new PriorityJob(job);
        //        this.allJobs.push(item);
        //    });
        //}
        //this.dataSource = new MatTableDataSource(this.allJobs);
        //this.progressbar.hideProgress();
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
            //styleUrls: ['../jobs-load/jobs-load.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], InOutTimeComponent);
    return InOutTimeComponent;
}());
exports.InOutTimeComponent = InOutTimeComponent;
