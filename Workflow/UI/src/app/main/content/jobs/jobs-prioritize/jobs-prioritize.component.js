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
var material_1 = require("@angular/material");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var jobs_model_1 = require("../jobs.model");
//declare let $: any;
var JobsPrioritizeComponent = /** @class */ (function () {
    function JobsPrioritizeComponent(jobsService, dialog, router, loginService, snackComp, utilities) {
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_checkbox'];
        this.priorityColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'p_buttons'];
        this.jobPriorityChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.searchInput = new forms_1.FormControl('');
    }
    JobsPrioritizeComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.isSavable = false;
        this.isGridView = true;
        //this.getAllJobs();
        this.dataSource = new material_1.MatTableDataSource(this.allJobs);
        this.getPrioritizedJobList();
        /* Drag & Drop feature - Not used */
        {
            ////$("#sortable1, #sortable2").sortable({
            ////    connectWith: ".connectedSortable",
            ////    revert: false//,
            ////    //stop: function (event, ui) {
            ////    //    debugger;
            ////    //    this.sortedArray = $("#sortable2").sortable("toArray");
            ////    //}
            ////}).disableSelection();
            ////$("#sortable2").on("sortstop", (event, ui) => {
            ////    console.log(this.prioritizedJobs);
            ////    console.log(this.allJobs);
            ////});
            ////$("#sortable2").on("sortactivate", function (event, ui) {
            ////    //console.log('dropped');
            ////    //debugger;
            ////    console.log(this.allJobs);
            ////    //let job = ui.item;
            ////    //if (job.length > 0)
            ////    //{
            ////    //    job = job[0];
            ////    //    let item = this.allJobs.find((x) => {
            ////    //        if (x.jobid == job.id)
            ////    //            return x;
            ////    //    });
            ////    //    if (this.prioritizedJobs.length == 0)
            ////    //    {                    
            ////    //        this.prioritizedJobs.push(item);
            ////    //    }
            ////    //    else
            ////    //    {
            ////    //        let previousJobId = 0;
            ////    //        if (job.previousElementSibling != null)
            ////    //            previousJobId = job.previousElementSibling.Id;
            ////    //        let itemExists = this.prioritizedJobs.find((x) => {
            ////    //            if (x.jobid == job.id)
            ////    //                return x;
            ////    //        });
            ////    //        if (itemExists == null || itemExists == undefined)
            ////    //        {
            ////    //            if (previousJobId > 0)
            ////    //                this.prioritizedJobs.push(item);
            ////    //            else
            ////    //            {
            ////    //                let index = this.prioritizedJobs.findIndex((x) => {
            ////    //                    if (x.jobid == previousJobId)
            ////    //                        return x;
            ////    //                });
            ////    //                this.prioritizedJobs.splice(0, 0, item);
            ////    //            }
            ////    //        }
            ////    //    }
            ////    //}
            ////});
        }
    };
    JobsPrioritizeComponent.prototype.ngOnDestroy = function () {
    };
    JobsPrioritizeComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
    };
    JobsPrioritizeComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    //onChangeView(index)
    //{
    //    if (index == 1)
    //    {
    //        this.isGridView = t
    //    }
    //}
    JobsPrioritizeComponent.prototype.onSelectionChange = function (job, event) {
        //var abc = this.allJobs.filter(x => x.jobid == job.jobid);
        debugger;
    };
    JobsPrioritizeComponent.prototype.addToPriorityList = function () {
        var _this = this;
        var selectedJobs = this.allJobs.filter(function (x) { return (x.isprioritized && !x.isremoved) || x.isselected == true; });
        selectedJobs.map(function (x) {
            if ((x.isprioritized && !x.isremoved) || x.isselected) {
                var job = _this.prioritizedJobs.filter(function (y) { return y.jobid == x.jobid; });
                if (job.length == 0) {
                    _this.prioritizedJobs.push(x);
                }
            }
        });
        this.jobPriorityChanged.next(this.prioritizedJobs);
        this.dataSourcePriority = new material_1.MatTableDataSource(this.prioritizedJobs);
        this.isSavable = true;
    };
    JobsPrioritizeComponent.prototype.moveUp = function (job) {
        var index = this.prioritizedJobs.indexOf(job);
        if (index < this.prioritizedJobs.length) {
            this.prioritizedJobs.splice(index, 1);
            this.prioritizedJobs.splice(index - 1, 0, job);
            this.dataSourcePriority = new material_1.MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    };
    JobsPrioritizeComponent.prototype.moveDown = function (job) {
        var index = this.prioritizedJobs.indexOf(job);
        if (index < this.prioritizedJobs.length) {
            this.prioritizedJobs.splice(index, 1);
            this.prioritizedJobs.splice(index + 1, 0, job);
            this.dataSourcePriority = new material_1.MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    };
    JobsPrioritizeComponent.prototype.removePriority = function (job) {
        var index = this.prioritizedJobs.indexOf(job);
        if (index >= 0) {
            this.prioritizedJobs.splice(index, 1);
            this.dataSourcePriority = new material_1.MatTableDataSource(this.prioritizedJobs);
            this.isSavable = true;
        }
    };
    JobsPrioritizeComponent.prototype.savePriority = function () {
        var _this = this;
        //var ab = $("#sortable").sortable("toArray");
        this.progressbar.showProgress();
        var ids = this.prioritizedJobs.map(function (x) { return x.jobid; });
        this.jobsService.savePriority(ids.join())
            .then(function (response) {
            _this.isSavable = false;
            _this.getAllJobs();
            _this.progressbar.hideProgress();
            _this.snackComp.showSnackBarPost(response, '');
        });
    };
    JobsPrioritizeComponent.prototype.getPrioritizedJobList = function () {
        var _this = this;
        this.prioritizedJobs = [];
        this.progressbar.showProgress();
        this.jobsService.getPrioritizedJobList().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                response.map(function (job) {
                    _this.prioritizedJobs.push(job);
                });
                _this.getAllJobs();
                _this.dataSourcePriority = new material_1.MatTableDataSource(_this.prioritizedJobs);
            }
        });
    };
    JobsPrioritizeComponent.prototype.getAllJobs = function () {
        var _this = this;
        var prioritizedJobIds = [];
        this.allJobs = [];
        if (this.prioritizedJobs == undefined)
            this.prioritizedJobs = [];
        this.progressbar.showProgress();
        this.prioritizedJobs.forEach(function (x) {
            prioritizedJobIds.push(x.jobid);
        });
        if (prioritizedJobIds.length > 0) {
            this.jobsService.newJobs.slice(0, 120).map(function (job) {
                var item = new jobs_model_1.PriorityJob(job);
                var index = prioritizedJobIds.indexOf(parseInt(job.jobid));
                if (index >= 0) {
                    item.isprioritized = true;
                }
                _this.allJobs.push(item);
            });
        }
        else {
            this.jobsService.newJobs.slice(0, 120).map(function (job) {
                var item = new jobs_model_1.PriorityJob(job);
                _this.allJobs.push(item);
            });
        }
        this.dataSource = new material_1.MatTableDataSource(this.allJobs);
        this.progressbar.hideProgress();
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobsPrioritizeComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobsPrioritizeComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobsPrioritizeComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobsPrioritizeComponent.prototype, "sort", void 0);
    JobsPrioritizeComponent = __decorate([
        core_1.Component({
            selector: 'prioritizejobs',
            templateUrl: './jobs-prioritize.component.html',
            styleUrls: ['../jobs-load/jobs-load.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsPrioritizeComponent);
    return JobsPrioritizeComponent;
}());
exports.JobsPrioritizeComponent = JobsPrioritizeComponent;
var JobsPrioritizedComponent = /** @class */ (function () {
    function JobsPrioritizedComponent(jobsService, dialog, router, loginService, snackComp, utilities) {
        this.jobsService = jobsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_selectedUser', 'jn_buttons'];
        this.searchInput = new forms_1.FormControl('');
    }
    JobsPrioritizedComponent.prototype.ngOnInit = function () {
        if (this.loginService.loggedUser.rolename == this.utilities.rn_recruiter) {
            this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_buttons'];
        }
        else {
            this.displayedColumns = ['referenceid', 'title', 'location', 'clientname', 'publisheddate', 'jn_selectedUser'];
        }
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new material_1.MatTableDataSource(this.prioritizedJobs);
        this.getPrioritizedJobList();
    };
    JobsPrioritizedComponent.prototype.ngOnDestroy = function () {
    };
    JobsPrioritizedComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
    };
    JobsPrioritizedComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    JobsPrioritizedComponent.prototype.interestedJob = function (job) {
        var _this = this;
        this.jobsService.saveInterestedJob(job)
            .then(function (response) {
            job.isinterested = true;
            _this.snackComp.showSnackBarPost(response, '');
        });
    };
    JobsPrioritizedComponent.prototype.getPrioritizedJobList = function () {
        var _this = this;
        this.prioritizedJobs = [];
        this.progressbar.showProgress();
        this.jobsService.getPrioritizedJobList().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                response.map(function (job) {
                    _this.prioritizedJobs.push(job);
                });
                _this.dataSource = new material_1.MatTableDataSource(_this.prioritizedJobs);
            }
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobsPrioritizedComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobsPrioritizedComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobsPrioritizedComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobsPrioritizedComponent.prototype, "sort", void 0);
    JobsPrioritizedComponent = __decorate([
        core_1.Component({
            selector: 'prioritizedjobs',
            templateUrl: './jobs-prioritized.component.html',
            styleUrls: ['../jobs-load/jobs-load.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsPrioritizedComponent);
    return JobsPrioritizedComponent;
}());
exports.JobsPrioritizedComponent = JobsPrioritizedComponent;
