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
var startWith_1 = require("rxjs/operators/startWith");
var map_1 = require("rxjs/operators/map");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var email_model_1 = require("../email.model");
var ComposeEmailComponent = /** @class */ (function () {
    function ComposeEmailComponent(emailService, router, formBuilder, jobsService, snackComp, utilities) {
        this.emailService = emailService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.jobsService = jobsService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.isSavable = false;
        this.jobsAC = new forms_1.FormControl();
        this.emailForm = new email_model_1.ComposeEmail({});
        $(document).ready(function () {
            $('#summernote').summernote({
                height: 150,
                tabsize: 2,
                toolbar: [
                    ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough', 'superscript', 'subscript']],
                    ['font', ['fontname', 'fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']]
                ]
            });
        });
    }
    ComposeEmailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.getJobList();
        this.getEmailDetails();
        this.jobsAC.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            if (searchText.length == 0) {
                _this.clearJob();
                _this.validateForm();
            }
        });
    };
    ComposeEmailComponent.prototype.ngOnDestroy = function () {
    };
    ComposeEmailComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    ComposeEmailComponent.prototype.selectedEmail = function (event) {
        if (event.value != undefined) {
            var emailDetail = this.emailDetails.filter(function (x) {
                return x.emailtypeid == event.value;
            });
            this.toDetails = emailDetail[0].todetails;
        }
        this.validateForm();
    };
    ComposeEmailComponent.prototype.selectedTo = function (event) {
        this.validateForm();
    };
    ComposeEmailComponent.prototype.optionSelectedJob = function (event) {
        if (event.option != undefined && event.option.value != undefined) {
            var job = this.jobList.filter(function (x) {
                return x.jobid == event.option.value;
            });
            this.emailForm.jobid = event.option.value;
            this.emailForm.formattedjob = job[0].formattedtitle;
            this.emailForm.subject = job[0].formattedtitle2;
            this.emailForm.body = job[0].description;
            $('#summernote').summernote('code', this.emailForm.body);
        }
        else {
            this.clearJob();
        }
        this.validateForm();
    };
    ComposeEmailComponent.prototype.clearForm = function () {
        this.emailForm = new email_model_1.ComposeEmail({});
        $('#summernote').summernote('code', '');
        this.isSavable = false;
        this.bindEmailType();
    };
    ComposeEmailComponent.prototype.validateForm = function () {
        var form = this.emailForm;
        if (form.emailtypeid > 0 && form.jobid > 0 && form.toaddresses.length > 0)
            this.isSavable = true;
        else
            this.isSavable = false;
    };
    ComposeEmailComponent.prototype.sendEmail = function () {
        var _this = this;
        this.validateForm();
        if (this.isSavable) {
            this.emailForm.body = $('#summernote').summernote('code');
            this.progressbar.showProgress();
            this.emailService.sendEmail(this.emailForm).then(function (response) {
                if (response) {
                    if (response["ResultStatus"] == "1")
                        _this.clearForm();
                    _this.progressbar.hideProgress();
                    _this.snackComp.showSnackBarPost(response, '');
                }
            });
        }
    };
    ComposeEmailComponent.prototype.getJobList = function () {
        var _this = this;
        this.jobList = [];
        if (this.jobsService.newJobs.length == 0) {
            this.jobsService.getNewJobs(true).then(function (response) {
                if (response) {
                    _this.jobList = response;
                }
            });
        }
        else {
            this.jobList = this.jobsService.newJobs;
        }
        this.jobList.sort(function (a, b) {
            var x = a.formattedtitle;
            var y = b.formattedtitle;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        this.filteredjobList = this.jobsAC.valueChanges.pipe(startWith_1.startWith(''), map_1.map(function (job) { return job ? _this.filterJobs(job) : _this.jobList.slice(); }));
    };
    ComposeEmailComponent.prototype.getEmailDetails = function () {
        var _this = this;
        this.emailService.getEmailDetails().then(function (response) {
            if (response) {
                _this.emailDetails = response;
                _this.bindEmailType();
            }
        });
    };
    ComposeEmailComponent.prototype.bindEmailType = function () {
        if (this.emailDetails.length == 1) {
            this.toDetails = this.emailDetails[0].todetails;
            this.emailForm.emailtypeid = this.emailDetails[0].emailtypeid;
        }
    };
    ComposeEmailComponent.prototype.filterJobs = function (content) {
        return this.jobList.filter(function (job) {
            return job.title.toLowerCase().indexOf(content.toString().toLowerCase()) === 0;
        });
    };
    ComposeEmailComponent.prototype.clearJob = function () {
        this.emailForm.jobid = 0;
        this.emailForm.formattedjob = '';
        this.emailForm.subject = '';
        this.emailForm.body = '';
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ComposeEmailComponent.prototype, "dialogContent", void 0);
    ComposeEmailComponent = __decorate([
        core_1.Component({
            selector: 'composeemail',
            templateUrl: './composeemail.component.html',
            //styleUrls: ['./jobs-client.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ComposeEmailComponent);
    return ComposeEmailComponent;
}());
exports.ComposeEmailComponent = ComposeEmailComponent;
