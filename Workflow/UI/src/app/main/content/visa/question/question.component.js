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
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var collections_1 = require("@angular/cdk/collections");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var confirm_dialog_component_1 = require("../../../../core/components/confirm-dialog/confirm-dialog.component");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var visa_model_1 = require("../visa.model");
var QuestionComponent = /** @class */ (function () {
    function QuestionComponent(router, confirmDialog, dialog, loginService, jobService, visaService, snackComp, utilities) {
        this.router = router;
        this.confirmDialog = confirmDialog;
        this.dialog = dialog;
        this.loginService = loginService;
        this.jobService = jobService;
        this.visaService = visaService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['sq_qnumber', 'sq_question', 'sq_qtype', 'sq_button'];
        this.displayedConsultantColumns = ['vc_name', 'vc_email', 'vc_workstatus', 'vc_currentLocation', 'vc_totalExp', 'vc_button'];
        this.isAdminUser = false;
        this.isFormExpanded = true;
        this.isSavable = false;
        this.isDisabled = false;
        this.isVisible = true; /* This field is used to enable/disable Questions tab. */
        this.isResponseDivVisible = false; /* This field is used to show/hide Response div in Add/Edit Question. */
        this.selectedResponseId = 0;
        this.showResponseField = false; /* This field is used to show/hide Response textbox in Add/Edit Question. */
        this.showNACheckbox = false; /* This field is used to show/hide Show N/A checkbox in Add/Edit Question. */
        this.showNAOption = false; /* This field is used to show/hide Show N/A option in Dropdown for Checkbox type question in Add/Edit Question. */
        this.showAddResponse = false; /* This field is used to show/hide Add button for adding response to question in Add/Edit Question. */
        this.isScreeningStarted = false; /* This field is used to show/hide 'Start Screening' button. */
        this.hasScreenQuestion = false; /* This field is used to show/hide 'Start Screening' button and 'No question div' vice versa. */
        this.showResume = false; /* This field is used to show/hide 'Resume Screening' button. */
        this.isPreScreenButtonEnabled = false; /* This field is used to enable/disable 'Resume/Start Screening' button. */
        this.isNextQuestionEnabled = false; /* This field is used to enable/disable 'Next Question' button. */
        this.isNextQuestionVisible = false; /* This field is used to show/hide 'Next Question' button. */
        this.isEndScreeningEnabled = false; /* This field is used to enable/disable 'End Screening' button. */
        this.isEndScreeningVisible = false; /* This field is used to show/hide 'End Screening' button. */
        this.isCompleteScreeningEnabled = false; /* This field is used to enable/disable 'Complete Screening' button. */
        this.isCompleteScreeningVisible = false; /* This field is used to show/hide 'Complete Screening' button. */
        this.canSummarize = false; /* This field is used to show/hide Summary div. */
        this.listboxHeight = 75;
        this.isConsultantLoaded = false;
        this.selectedTabIndex = 0;
        this.searchInput = new forms_1.FormControl('');
        this.questionForm = new visa_model_1.ScreenQuestion({});
        this.editQuestion = new visa_model_1.ScreenQuestion({});
    }
    QuestionComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_VQuestion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.screenedProcess = new visa_model_1.ScreenedProcess({});
        this.dataSource = new FilesDataSource(this.visaService, this.paginator, this.sort);
        this.consultantData = new ConsultantDataSource(this.visaService, this.paginator, this.sort);
        this.refresh();
    };
    QuestionComponent.prototype.ngOnDestroy = function () {
        this._clearTemp();
    };
    QuestionComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    };
    QuestionComponent.prototype.refresh = function () {
        var _this = this;
        this.isConsultantLoaded = false;
        if (this.loginService.loggedUser.rolename == this.utilities.rn_superuser) {
            this.isAdminUser = true;
            this.getScreenQuestions();
            this.jobList = this.jobService.newJobs;
            this.isVisible = true;
            this.selectedTabIndex = 0;
        }
        else {
            this.isVisible = false;
            this.selectedTabIndex = 1;
            var recruiterStartedJob = this.visaService.recruiterSelectedJob.find(function (x) { return x.userid == _this.loginService.loggedUser.userid; });
            if (recruiterStartedJob != undefined) {
                this.screenedProcess.jobid = recruiterStartedJob.job.jobid;
                this.screenedProcess.jobcode = recruiterStartedJob.job.referenceid;
                this.screenedProcess.jobtitle = recruiterStartedJob.job.title;
                this.screenedProcess.joblocation = recruiterStartedJob.job.location;
                this.getScreenQuestions();
            }
            else
                this._showUnauthorizedDialog();
        }
        this.clearQuestion();
        if (this.visaService.screening.questions.length > 0) {
            this.showResume = true;
            this.validatePreScreenForm(true);
        }
    };
    QuestionComponent.prototype.getScreenQuestions = function () {
        var _this = this;
        this.visaService.getScreenQuestions().then(function (response) {
            if (response) {
                _this.getResponseAction();
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    QuestionComponent.prototype.selectedTabChange = function (event) {
        if (event.tab.textLabel == this.utilities.tabQuestion) {
            this.isFormExpanded = true;
        }
        else if (event.tab.textLabel == this.utilities.tabScreening) {
            if (this.screenQuestions.length > 0)
                this.hasScreenQuestion = true;
        }
    };
    /* Questions Tab Functions */
    /* Validates the Question form on any changes. */
    QuestionComponent.prototype.validateForm = function () {
        var oq = this.editQuestion;
        var q = this.questionForm;
        this.isSavable = false;
        /* New Question */
        if (q.questionid == 0) {
            if (q.questionnumber != '' && q.question != '' && q.questiontype != '') {
                if (q.questiontype == this.utilities.questionTypeDropdown) {
                    if (q.options.length >= 1)
                        this.isSavable = true;
                }
                else
                    this.isSavable = true;
            }
        }
        else {
            var hasActionChanges = false;
            var isValid = false;
            if (q.questiontype == this.utilities.questionTypeText || q.questiontype == this.utilities.questionTypeTextArea) {
                if (q.optionaction != oq.optionaction)
                    hasActionChanges = true;
            }
            else if (q.questiontype == this.utilities.questionTypeCheckbox) {
                if (q.showNA != oq.showNA)
                    hasActionChanges = true;
                else if (q.options.length != oq.options.length)
                    hasActionChanges = true;
                else if (q.options.length > 0) {
                    var hasChange = q.options.find(function (x) { return x.optionid == 0; });
                    if (hasChange != undefined)
                        hasActionChanges = true;
                }
            }
            else if (q.questiontype == this.utilities.questionTypeDropdown) {
                if (q.options.length != oq.options.length)
                    hasActionChanges = true;
                else if (q.options.length > 0) {
                    var hasChange = q.options.find(function (x) { return x.optionid == 0; });
                    if (hasChange != undefined)
                        hasActionChanges = true;
                }
                if ((q.options.length > 0 && hasActionChanges) || (q.options.length > 0 && (q.hint != oq.hint || q.isparent != oq.isparent || q.ismandatory != oq.ismandatory)))
                    this.isSavable = true;
                return;
            }
            if (q.hint != oq.hint || q.isparent != oq.isparent || q.ismandatory != oq.ismandatory || q.showNA != oq.showNA || hasActionChanges) {
                this.isSavable = true;
            }
        }
    };
    QuestionComponent.prototype.onQuestionTypeChange = function (event) {
        if (event.value != undefined) {
            this.questionOptions = [];
            this.questionForm.option = '';
            this.questionForm.optionaction = '';
            this.questionForm.optionna = false;
            this.questionForm.options = [];
            this.selectedResponseId = 0;
            this.isResponseDivVisible = true;
            this.showResponseField = true;
            this.showNACheckbox = false;
            this.showAddResponse = false;
            if (event.value == this.utilities.questionTypeCheckbox) {
                this.showNACheckbox = true;
                this.showAddResponse = true;
                this.showResponseField = false;
            }
            else if (event.value == this.utilities.questionTypeDropdown)
                this.showAddResponse = true;
            else if (event.value == this.utilities.questionTypeText || event.value == this.utilities.questionTypeTextArea)
                this.showResponseField = false;
            this.validateForm();
        }
    };
    QuestionComponent.prototype.onResponseActionChange = function (event) {
        var form = this.questionForm;
        if (this.editQuestion.questionid > 0) {
            if (this.selectedResponseId > 0)
                form.optionaction = this.selectedResponseId.toString();
            else
                form.optionaction = '';
            if (form.questiontype == this.utilities.questionTypeCheckbox || form.questiontype == this.utilities.questionTypeDropdown)
                return;
        }
        else {
            if (form.questiontype == this.utilities.questionTypeText || form.questiontype == this.utilities.questionTypeTextArea) {
                if (this.selectedResponseId > 0)
                    form.optionaction = this.selectedResponseId.toString();
                else
                    form.optionaction = '';
            }
            else if (form.questiontype == this.utilities.questionTypeCheckbox || form.questiontype == this.utilities.questionTypeDropdown) {
                form.options = this.questionOptions;
                return;
            }
        }
        this.validateForm();
    };
    QuestionComponent.prototype.onParentCheckChange = function () {
        if (this.editQuestion.questionid > 0) {
            this.validateForm();
        }
    };
    QuestionComponent.prototype.onMandatoryCheckChange = function () {
        if (this.editQuestion.questionid > 0) {
            this.validateForm();
        }
    };
    QuestionComponent.prototype.showNAOptionCheckChange = function () {
        var _this = this;
        if (this.questionForm.questiontype == this.utilities.questionTypeCheckbox) {
            var naOption;
            this.questionForm.showNA = this.showNAOption;
            this.questionOptions.filter(function (x) {
                if (x.option === _this.utilities.questionNAText)
                    naOption = x;
            });
            if (naOption != undefined)
                this.removeResponse(naOption);
            if (this.questionForm.questionid > 0)
                this.validateForm();
        }
    };
    /* Add Response to Listbox when "Add Response" button is clicked. */
    QuestionComponent.prototype.addResponse = function () {
        var _this = this;
        var form = this.questionForm;
        var option = new visa_model_1.ScreenOption({});
        var hasResponse = false;
        if (form.option != '') {
            option.option = form.option;
            option.optionaction = this.selectedResponseId.toString() == undefined ? '' : this.selectedResponseId.toString();
            if (this.selectedResponseId > 0) {
                var q = this.screenQuestions.find(function (x) { return x.questionid == _this.selectedResponseId; });
                if (q != undefined) {
                    option.questionnumber = q.questionnumber;
                    option.question = q.question;
                }
            }
            if (this.questionOptions.length > 0) {
                this.questionOptions.filter(function (x) {
                    if (x.option === option.option)
                        hasResponse = true;
                });
            }
            if (hasResponse)
                this.snackComp.showSimpleWarning('Response should be unique.');
            else {
                if (form.questiontype == this.utilities.questionTypeCheckbox && form.option == this.utilities.questionNAText)
                    option.isNA = true;
                this.questionOptions.push(option);
                this.questionForm.optionaction = '';
                this.validateForm();
            }
        }
    };
    /* Remove Response from Listbox when "X" button in Listbox is clicked. */
    QuestionComponent.prototype.removeResponse = function (option) {
        var index = this.questionOptions.indexOf(option);
        if (index >= 0) {
            this.questionOptions.splice(index, 1);
            this.validateForm();
        }
    };
    /*  Clears the Question form controls. */
    QuestionComponent.prototype.clearQuestion = function () {
        var _this = this;
        if (this.editQuestion.questionid > 0) {
            var old = this.visaService.screenQuestions.find(function (x) { return x.questionid == _this.editQuestion.questionid; });
            var index = this.visaService.screenQuestions.indexOf(old);
            this.visaService.screenQuestions[index] = this.editQuestion;
        }
        this.questionForm = new visa_model_1.ScreenQuestion({});
        this.editQuestion = new visa_model_1.ScreenQuestion({});
        this.questionOptions = new Array();
        this.isResponseDivVisible = false;
        this.isDisabled = false;
        this.isSavable = false;
    };
    QuestionComponent.prototype.saveQuestion = function () {
        var _this = this;
        this.validateForm();
        if (!this.isSavable) {
            this.snackComp.showSimpleWarning('Please fill the required fields.');
            return;
        }
        var form = this.questionForm;
        this.progressbar.showProgress();
        this.visaService.saveScreenQuestion(form).then(function (response) {
            if (response) {
                if (response['ResultStatus'] == 1) {
                    _this.getScreenQuestions();
                    _this.clearQuestion();
                }
                _this.progressbar.hideProgress();
                _this.snackComp.showSnackBarPost(response, '');
            }
        });
    };
    QuestionComponent.prototype.deleteQuestion = function (question) {
        var _this = this;
        this.confirmDialogComp = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogComp.componentInstance.title = this.utilities.questionDeleteConfirmTitle;
        this.confirmDialogComp.componentInstance.confirmMessage = this.utilities.questionDeleteConfirmMessage;
        this.confirmDialogComp.afterClosed().subscribe(function (result) {
            if (result) {
                _this.progressbar.showProgress();
                _this.visaService.deleteQuestion(question.questionid).then(function (response) {
                    if (response) {
                        if (response['ResultStatus'] == 1) {
                            _this.visaService.getQuestions().then(function (result) {
                            });
                            _this.clearQuestion();
                        }
                        _this.progressbar.hideProgress();
                        _this.snackComp.showSnackBarPost(response, '');
                    }
                });
            }
            _this.confirmDialogComp = null;
        });
    };
    QuestionComponent.prototype.selectedQuestion = function (question) {
        var _this = this;
        if (question.questionid == this.editQuestion.questionid)
            return;
        if (this.editQuestion.questionid > 0) {
            var old = this.visaService.screenQuestions.find(function (x) { return x.questionid == _this.editQuestion.questionid; });
            var index = this.visaService.screenQuestions.indexOf(old);
            this.visaService.screenQuestions[index] = this.editQuestion;
        }
        if (question.questionid > 0) {
            var newQ = this.visaService.screenQuestions.find(function (x) { return x.questionid == question.questionid; });
            var index = this.visaService.screenQuestions.indexOf(newQ);
            question = this.visaService.screenQuestions[index];
        }
        this.clearQuestion();
        this.isDisabled = true;
        this.isFormExpanded = true;
        this.selectedResponseId = 0;
        this.editQuestion.questionid = question.questionid;
        this.editQuestion.parentquestionid = question.parentquestionid;
        this.editQuestion.questionnumber = question.questionnumber;
        this.editQuestion.question = question.question;
        this.editQuestion.questiontype = question.questiontype;
        this.editQuestion.hint = question.hint;
        this.editQuestion.showNA = question.showNA;
        this.editQuestion.ismandatory = question.ismandatory;
        this.editQuestion.isparent = question.isparent;
        this.editQuestion.sortorder = question.sortorder;
        this.editQuestion.option = question.option;
        this.editQuestion.optionna = question.optionna;
        this.editQuestion.optionaction = question.optionaction;
        question.options.forEach(function (x) {
            _this.editQuestion.options.push(x);
        });
        if (question.questiontype != undefined) {
            this.questionForm = question;
            this.questionOptions = [];
            this.isResponseDivVisible = true;
            this.showResponseField = true;
            this.showNACheckbox = false;
            this.showAddResponse = false;
            this.questionOptions = question.options;
            this.showNAOption = question.showNA;
            if (question.questiontype == this.utilities.questionTypeCheckbox) {
                this.showNACheckbox = true;
                this.showAddResponse = true;
                this.showResponseField = false;
            }
            else if (question.questiontype == this.utilities.questionTypeDropdown)
                this.showAddResponse = true;
            else if (question.questiontype == this.utilities.questionTypeText || question.questiontype == this.utilities.questionTypeTextArea) {
                this.showResponseField = false;
                if (question.options.length > 0 && question.options[0].optionaction.trim().length > 0) {
                    this.questionForm.optionaction = question.options[0].optionaction.trim();
                    this.editQuestion.optionaction = question.options[0].optionaction.trim();
                    this.selectedResponseId = parseInt(question.options[0].optionaction);
                }
                else {
                    this.questionForm.optionaction = '';
                    this.editQuestion.optionaction = '';
                    this.selectedResponseId = 0;
                }
            }
        }
        ////this.validateForm();
    };
    /* End Questions Tab Functions */
    /************************************************************************************************/
    /* Screening Tab Functions */
    QuestionComponent.prototype.validatePreScreenForm = function (isOnload) {
        this.isPreScreenButtonEnabled = false;
        if (isOnload) {
            if (this.showResume) {
                this.screenedProcess = this.visaService.screening;
            }
        }
        if (this.screenedProcess.firstname.trim().length > 0 && this.screenedProcess.lastname.trim().length > 0 && this.screenedProcess.currentlocation.trim().length > 0
            && this.screenedProcess.email.trim().length > 0 && this.utilities.ValidateEmail(this.screenedProcess.email) && this.screenedProcess.phone.trim().length == 10
            && (this.screenedProcess.jobid != undefined && this.screenedProcess.jobid.toString().trim().length > 0)) {
            this.isPreScreenButtonEnabled = true;
            this.saveLocalPreScreening();
        }
    };
    QuestionComponent.prototype.onPreScreenQuestion = function () {
        this.validatePreScreenForm(false);
    };
    /* Job change for Dropdown in Pre-screen Questions. */
    QuestionComponent.prototype.onJobChange = function (event) {
        if (event.value != undefined) {
            this.screenedProcess.jobid = event.value.jobid;
            this.screenedProcess.jobcode = event.value.referenceid;
            this.screenedProcess.jobtitle = event.value.title;
            this.screenedProcess.joblocation = event.value.location;
        }
        this.validatePreScreenForm(false);
    };
    /* Start Screening process. */
    QuestionComponent.prototype.startScreening = function () {
        this.onPreScreenQuestion();
        if (!this.isPreScreenButtonEnabled) {
            this.snackComp.showSimpleWarning('Please fill the required fields.');
            return;
        }
        this.screeningQuestions = [];
        this.clearLocalScreening();
        this.saveLocalPreScreening();
        if (this.screenQuestions.length > 0) {
            this.screenQuestions[0].option = '';
            this.screenQuestions[0].optionna = false;
            var question = this.screenQuestions.find(function (x) { return x.isparent == true; });
            this.screeningQuestions.push(this._cleanQuestion(question));
            this.isScreeningStarted = true;
        }
        this.endScreeningProperty();
        this.screeningButtonProperties();
    };
    /* Resume Screening process. */
    QuestionComponent.prototype.resumeScreening = function () {
        this.onPreScreenQuestion();
        if (!this.isPreScreenButtonEnabled) {
            this.snackComp.showSimpleWarning('Please fill the required fields.');
            return;
        }
        this.screeningQuestions = [];
        if (this.visaService.screening.questions.length > 0) {
            this.screeningQuestions = this.visaService.screening.questions;
            this.screenedProcess.questions = this.visaService.screening.questions;
            this.showResume = false;
            this.isScreeningStarted = true;
        }
        this.endScreeningProperty();
        this.screeningButtonProperties();
    };
    /* Key-up event for Textbox to provide response for Question. */
    QuestionComponent.prototype.onResponse = function (screenQuestion) {
        if ((screenQuestion.ismandatory && screenQuestion.option.trim().length > 0) || !screenQuestion.ismandatory)
            this.showNextQuestion(screenQuestion);
        else
            this.removeNextQuestion(screenQuestion);
    };
    /* Selection-chane event for Dropdown to provide response for Question. */
    QuestionComponent.prototype.onResponseChange = function (screenQuestion, event) {
        if (event.value != undefined)
            screenQuestion.option = event.value;
        if ((screenQuestion.ismandatory && screenQuestion.option.trim().length > 0) || !screenQuestion.ismandatory) {
            this.showNextQuestion(screenQuestion);
        }
        else {
            this.removeNextQuestion(screenQuestion);
        }
    };
    /* Check-change event for Checkbox to provide response for Question. */
    QuestionComponent.prototype.onResponseCheckChange = function (screenQuestion, event, isNA) {
        if (isNA && event.checked == true)
            screenQuestion.option = false;
        else if (!isNA && event.checked == true)
            screenQuestion.optionna = false;
        this.showNextQuestion(screenQuestion);
    };
    /* When 'Next Button' is clicked. */
    QuestionComponent.prototype.nextQuestion = function () {
        if (this.screeningQuestions.length > 0 && this.screeningQuestions.length != this.screenQuestions.length) {
            var question = this.screeningQuestions[this.screeningQuestions.length - 1];
            var parentQuestions = this.screenQuestions.filter(function (x) { return x.isparent == true; });
            var screenedParentQuestions = this.screeningQuestions.filter(function (x) { return x.isparent == true; });
            var screenedLastParentQuestion_1 = screenedParentQuestions[screenedParentQuestions.length - 1];
            if (question.options.length > 0)
                this.addNextQuestionWithOption(question);
            else {
                var nextQuestion = this.screenQuestions.find(function (x) { return x.isparent == true && x.questionid > screenedLastParentQuestion_1.questionid; });
                if (nextQuestion != undefined)
                    this.screeningQuestions.push(this._cleanQuestion(nextQuestion));
            }
        }
        this.saveLocalScreening();
        this.screeningButtonProperties();
    };
    /* Key-up event for entering comments for ending the screen process. */
    QuestionComponent.prototype.onEndScreenComment = function () {
        this.endScreeningProperty();
    };
    /* Cancel Screening process. */
    QuestionComponent.prototype.cancelScreening = function () {
        var _this = this;
        this.confirmDialogComp = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogComp.componentInstance.title = this.utilities.screeningCancelConfirmTitle;
        this.confirmDialogComp.componentInstance.confirmMessage = this.utilities.screeningCancelConfirmMessage;
        this.confirmDialogComp.afterClosed().subscribe(function (result) {
            if (result) {
                _this.clearScreeningProcess();
            }
            _this.confirmDialogComp = null;
        });
    };
    /* Complete/End Screening process. */
    QuestionComponent.prototype.saveScreening = function (isTerminated) {
        var _this = this;
        this.screenedProcess.isterminated = false;
        if (isTerminated) {
            this.screenedProcess.isterminated = true;
            this.confirmDialogComp = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
                disableClose: false
            });
            this.confirmDialogComp.componentInstance.title = this.utilities.screeningEndConfirmTitle;
            this.confirmDialogComp.componentInstance.confirmMessage = this.utilities.screeningEndConfirmMessage;
            this.confirmDialogComp.afterClosed().subscribe(function (result) {
                if (result) {
                    if (_this.screenedProcess.endreason.trim().length <= 0)
                        _this.snackComp.showSimpleWarning(_this.utilities.screeningEndRequiredMessage);
                    else
                        _this.saveScreeningProcess();
                }
                _this.confirmDialogComp = null;
            });
        }
        else
            this.saveScreeningProcess();
    };
    /* Copy screening summary. */
    QuestionComponent.prototype.copyToClipboard = function () {
        var textarea = document.createElement('textarea');
        textarea.textContent = document.getElementById('divSummary').innerText;
        document.body.appendChild(textarea);
        var selection = document.getSelection();
        var range = document.createRange();
        range.selectNode(textarea);
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            document.execCommand('copy');
        }
        catch (error) {
            this.snackComp.showSimpleWarning('Does not support/failed copying the summary.  Please press Ctrl/Cmd + C to copy.');
        }
        selection.removeAllRanges();
        document.body.removeChild(textarea);
    };
    /* Close current screening. */
    QuestionComponent.prototype.closeScreening = function () {
        this.clearScreeningProcess();
    };
    QuestionComponent.prototype._cleanQuestion = function (question) {
        if (question != undefined) {
            question.option = '';
            question.optionna = false;
            question.optionaction = '';
        }
        return question;
    };
    QuestionComponent.prototype.getResponseAction = function () {
        this.responseActions = this.visaService.screenQuestions.filter(function (x) { return x.isparent == false; });
        this.screenQuestions = this.visaService.screenQuestions;
        if (this.screenQuestions.length > 0)
            this.hasScreenQuestion = true;
        else
            this.hasScreenQuestion = false;
    };
    QuestionComponent.prototype.showNextQuestion = function (screenQuestion) {
        var parentQuestions = this.screenQuestions.filter(function (x) { return x.isparent == true; });
        var screenedParentQuestions = this.screeningQuestions.filter(function (x) { return x.isparent == true; });
        var screenedLastParentQuestion = screenedParentQuestions[screenedParentQuestions.length - 1];
        if (screenQuestion.options.length > 0)
            this.addNextQuestionWithOption(screenQuestion);
        else {
            if (screenedLastParentQuestion.ismandatory && screenedLastParentQuestion.option.trim() != '') {
                var nextQuestion = this.screenQuestions.find(function (x) { return x.isparent == true && x.questionid > screenedLastParentQuestion.questionid; });
                if (nextQuestion != undefined) {
                    var actionQuestionInList = this.screeningQuestions.find(function (x) { return x.questionid == nextQuestion.questionid; });
                    if (actionQuestionInList == undefined)
                        this.screeningQuestions.push(this._cleanQuestion(nextQuestion));
                }
            }
        }
        this.saveLocalScreening();
        this.screeningButtonProperties();
    };
    QuestionComponent.prototype.addNextQuestionWithOption = function (question) {
        var _this = this;
        if (question.questiontype == this.utilities.questionTypeText || question.questiontype == this.utilities.questionTypeTextArea) {
            var newQuestionId_1 = question.options[0].optionaction;
            if (newQuestionId_1.trim().length > 0) {
                var actionQuestionInList = this.screeningQuestions.find(function (x) { return x.questionid.toString() == newQuestionId_1; });
                if (actionQuestionInList == undefined) {
                    var actionQuestion = this.screenQuestions.find(function (x) { return x.questionid.toString() == newQuestionId_1; });
                    actionQuestion.option = '';
                    actionQuestion.optionna = false;
                    this.screeningQuestions.push(this._cleanQuestion(actionQuestion));
                }
            }
        }
        else if (question.questiontype == this.utilities.questionTypeCheckbox) {
            var toAddOption;
            if (question.optionna) {
                toAddOption = question.options.find(function (y) { return y.option.toString() == _this.utilities.questionNAText; });
            }
            else if (question.option) {
                toAddOption = question.options.find(function (y) { return y.option.toString() == _this.utilities.questionCheckedText; });
            }
            else {
                toAddOption = question.options.find(function (y) { return y.option.toString() == _this.utilities.questionUnCheckedText; });
            }
            var toAddQuestion = this.screenQuestions.find(function (x) { return x.questionid.toString() == toAddOption.optionaction; });
            question.options.forEach(function (x) {
                var actionQuestionInList = _this.screeningQuestions.find(function (y) { return y.questionid.toString() == x.optionaction; });
                if (actionQuestionInList != undefined) {
                    var index = _this.screeningQuestions.indexOf(actionQuestionInList);
                    if (index >= 0)
                        _this.screeningQuestions.splice(index, _this.screeningQuestions.length - index);
                }
            });
            if (toAddQuestion != undefined) {
                this.screeningQuestions.push(this._cleanQuestion(toAddQuestion));
            }
        }
        else if (question.questiontype == this.utilities.questionTypeDropdown) {
            var toAddOption = question.options.find(function (y) { return y.option.toString() == question.option; });
            var toAddQuestion = this.screenQuestions.find(function (x) { return x.questionid.toString() == toAddOption.optionaction; });
            question.options.forEach(function (x) {
                var actionQuestionInList = _this.screeningQuestions.find(function (y) { return y.questionid.toString() == x.optionaction; });
                if (actionQuestionInList != undefined) {
                    var index = _this.screeningQuestions.indexOf(actionQuestionInList);
                    if (index >= 0)
                        _this.screeningQuestions.splice(index, _this.screeningQuestions.length - index);
                }
            });
            if (toAddQuestion != undefined) {
                this.screeningQuestions.push(this._cleanQuestion(toAddQuestion));
            }
        }
    };
    QuestionComponent.prototype.removeNextQuestion = function (screenQuestion) {
        if (screenQuestion.questiontype == this.utilities.questionTypeText || screenQuestion.questiontype == this.utilities.questionTypeTextArea) {
            var newQuestionId_2 = screenQuestion.options[0].optionaction;
            if (newQuestionId_2.trim().length > 0) {
                var actionQuestionInList = this.screeningQuestions.find(function (x) { return x.questionid.toString() == newQuestionId_2; });
                if (actionQuestionInList != undefined) {
                    var index = this.screeningQuestions.indexOf(actionQuestionInList);
                    if (index >= 0)
                        this.screeningQuestions.splice(index, this.screeningQuestions.length - index);
                }
            }
            else {
                var index = this.screeningQuestions.indexOf(screenQuestion);
                if (index >= 0)
                    this.screeningQuestions.splice(index + 1, this.screeningQuestions.length - index + 1);
            }
        }
        this.saveLocalScreening();
        this.screeningButtonProperties();
    };
    QuestionComponent.prototype.saveLocalPreScreening = function () {
        this.visaService.screening.firstname = this.screenedProcess.firstname.trim();
        this.visaService.screening.lastname = this.screenedProcess.lastname.trim();
        this.visaService.screening.currentlocation = this.screenedProcess.currentlocation.trim();
        this.visaService.screening.email = this.screenedProcess.email.trim();
        this.visaService.screening.phone = this.screenedProcess.phone.trim();
        this.screenedProcess.starttime = this.utilities.GetCurrentDateTime();
        this.visaService.screening.starttime = this.screenedProcess.starttime;
    };
    QuestionComponent.prototype.saveLocalScreening = function () {
        this.visaService.screening.questions = this.screeningQuestions;
    };
    QuestionComponent.prototype.clearLocalScreening = function () {
        this.visaService.screening = new visa_model_1.ScreenedProcess({});
    };
    QuestionComponent.prototype.clearScreeningProcess = function () {
        this.screeningQuestions = [];
        this.screenedProcess = new visa_model_1.ScreenedProcess({});
        this.isScreeningStarted = false;
        this.showResume = false;
        this.canSummarize = false;
        this.clearLocalScreening();
        this.screeningButtonProperties();
        this.validatePreScreenForm(false);
        if (!this.isAdminUser)
            this._gotoMyJobs();
    };
    QuestionComponent.prototype.saveScreeningProcess = function () {
        var _this = this;
        if (this.screeningQuestions.length > 0) {
            this.screenedProcess.questions = this.screeningQuestions;
            this.screenedProcess.endtime = this.utilities.GetCurrentDateTime();
            this.visaService.screening.endtime = this.screenedProcess.endtime;
            this.progressbar.showProgress();
            this.visaService.saveScreening(this.screenedProcess).then(function (response) {
                if (response) {
                    if (response['ResultStatus'] == 1) {
                        //this.getScreenQuestions();
                        _this.canSummarize = true;
                    }
                    _this.progressbar.hideProgress();
                    _this.snackComp.showSnackBarPost(response, '');
                }
            });
        }
    };
    QuestionComponent.prototype.screeningButtonProperties = function () {
        this.nextQuestionProperty();
        this.completeScreeningProperty();
    };
    QuestionComponent.prototype.nextQuestionProperty = function () {
        var hasActionQuestion = false, hasNextQuestion = false, hasResponse = false;
        var parentQuestions = this.screenQuestions.filter(function (x) { return x.isparent == true; });
        var screenedParentQuestions = this.screeningQuestions.filter(function (x) { return x.isparent == true; });
        this.isNextQuestionEnabled = false;
        this.isNextQuestionVisible = false;
        if (this.screeningQuestions.length > 0) {
            var screenedLastQuestion = this.screeningQuestions[this.screeningQuestions.length - 1];
            hasActionQuestion = this.hasActionQuestion();
            /* Total no. of parent question should be > no. of parent questions screened. */
            if (parentQuestions.length > screenedParentQuestions.length)
                hasNextQuestion = true;
            if ((hasNextQuestion || hasActionQuestion) && screenedLastQuestion.ismandatory) {
                if (screenedLastQuestion.questiontype == this.utilities.questionTypeText || screenedLastQuestion.questiontype == this.utilities.questionTypeTextArea || screenedLastQuestion.questiontype == this.utilities.questionTypeDropdown) {
                    if (screenedLastQuestion.option.trim().length > 0)
                        hasResponse = true;
                }
                else
                    hasResponse = true;
            }
            if (hasNextQuestion || hasActionQuestion) {
                this.isNextQuestionVisible = true;
                if (!screenedLastQuestion.ismandatory)
                    this.isNextQuestionEnabled = true;
                else if (hasResponse)
                    this.isNextQuestionEnabled = true;
            }
        }
    };
    QuestionComponent.prototype.endScreeningProperty = function () {
        this.isEndScreeningEnabled = false;
        this.isEndScreeningVisible = false;
        if (this.screeningQuestions.length > 0) {
            this.isEndScreeningVisible = true;
            if (this.screenedProcess != undefined && this.screenedProcess.endreason.trim().length > 0)
                this.isEndScreeningEnabled = true;
        }
    };
    QuestionComponent.prototype.completeScreeningProperty = function () {
        var hasActionQuestion = false;
        var parentQuestions = this.screenQuestions.filter(function (x) { return x.isparent == true; });
        var screenedParentQuestions = this.screeningQuestions.filter(function (x) { return x.isparent == true; });
        this.isCompleteScreeningEnabled = false;
        this.isCompleteScreeningVisible = false;
        if (this.screeningQuestions.length > 0) {
            this.isCompleteScreeningVisible = true;
            hasActionQuestion = this.hasActionQuestion();
        }
        if (parentQuestions.length == screenedParentQuestions.length && !hasActionQuestion) {
            this.isCompleteScreeningEnabled = true;
        }
    };
    QuestionComponent.prototype.hasActionQuestion = function () {
        var hasActionQuestion = false;
        if (this.screeningQuestions.length > 0) {
            var screenedLastQuestion_1 = this.screeningQuestions[this.screeningQuestions.length - 1];
            if (screenedLastQuestion_1.options.length > 0) {
                if (screenedLastQuestion_1.questiontype == this.utilities.questionTypeText || screenedLastQuestion_1.questiontype == this.utilities.questionTypeTextArea) {
                    if (screenedLastQuestion_1.options[0].optionaction.trim().length > 0)
                        hasActionQuestion = true;
                }
                else if (screenedLastQuestion_1.questiontype == this.utilities.questionTypeCheckbox) {
                    var selectedOption_1 = '';
                    if (screenedLastQuestion_1.option)
                        selectedOption_1 = this.utilities.questionCheckedText;
                    else if (screenedLastQuestion_1.optionna)
                        selectedOption_1 = this.utilities.questionNAText;
                    else
                        selectedOption_1 = this.utilities.questionUnCheckedText;
                    var option = screenedLastQuestion_1.options.find(function (x) { return x.option == selectedOption_1; });
                    if (option != undefined) {
                        if (option.optionaction.trim().length > 0)
                            hasActionQuestion = true;
                    }
                }
                else {
                    if (screenedLastQuestion_1.option.trim().length > 0) {
                        var option = screenedLastQuestion_1.options.find(function (x) { return x.option == screenedLastQuestion_1.option.trim(); });
                        if (option != undefined) {
                            if (option.optionaction.trim().length > 0)
                                hasActionQuestion = true;
                        }
                    }
                    else if (screenedLastQuestion_1.option.trim().length == 0 && screenedLastQuestion_1.ismandatory)
                        hasActionQuestion = true;
                }
            }
            else if ((screenedLastQuestion_1.questiontype == this.utilities.questionTypeText || screenedLastQuestion_1.questiontype == this.utilities.questionTypeTextArea) && screenedLastQuestion_1.ismandatory) {
                if (screenedLastQuestion_1.option.trim().length == 0)
                    hasActionQuestion = true;
            }
        }
        return hasActionQuestion;
    };
    QuestionComponent.prototype._gotoMyJobs = function () {
        var _this = this;
        var item = this.visaService.recruiterSelectedJob.find(function (x) { return x.userid == _this.loginService.loggedUser.userid; });
        if (item != undefined) {
            var index = this.visaService.recruiterSelectedJob.indexOf(item);
            if (index >= 0)
                this.visaService.recruiterSelectedJob.splice(index, 1);
        }
        this.router.navigateByUrl('/myjobs');
    };
    QuestionComponent.prototype._clearTemp = function () {
        var _this = this;
        var item = this.visaService.recruiterSelectedJob.find(function (x) { return x.userid == _this.loginService.loggedUser.userid; });
        if (item != undefined) {
            var index = this.visaService.recruiterSelectedJob.indexOf(item);
            if (index >= 0)
                this.visaService.recruiterSelectedJob.splice(index, 1);
        }
    };
    QuestionComponent.prototype._showUnauthorizedDialog = function () {
        var _this = this;
        this.confirmDialogComp = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogComp.componentInstance.showCancelButton = false;
        this.confirmDialogComp.componentInstance.actionButtonText = this.utilities.unauthorizedConfirmActionButtonText;
        this.confirmDialogComp.componentInstance.title = this.utilities.unauthorizedConfirmTitle;
        this.confirmDialogComp.componentInstance.confirmMessage = this.utilities.unauthorizedconfirmMessage;
        this.confirmDialogComp.afterClosed().subscribe(function (result) {
            if (_this.loginService.loggedUser.rolename == _this.utilities.rn_recruiter)
                _this.router.navigateByUrl('/myjobs');
            else if (_this.loginService.loggedUser.rolename == _this.utilities.rn_teamlead || _this.loginService.loggedUser.rolename == _this.utilities.rn_deliverymanager)
                _this.router.navigateByUrl('/jobs');
            else if (_this.loginService.loggedUser.rolename == _this.utilities.rn_reportuser)
                _this.router.navigateByUrl('/jobreport');
            _this.confirmDialogComp = null;
            return;
        });
    };
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], QuestionComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], QuestionComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], QuestionComponent.prototype, "sort", void 0);
    QuestionComponent = __decorate([
        core_1.Component({
            selector: 'visa-question',
            templateUrl: './question.component.html',
            styleUrls: ['../visa.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], QuestionComponent);
    return QuestionComponent;
}());
exports.QuestionComponent = QuestionComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(visaService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.visaService = visaService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.visaService.screenQuestions != undefined)
            _this.filteredData = _this.visaService.screenQuestions;
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
        var displayDataChanges = [];
        if (this._paginator != undefined)
            displayDataChanges = [
                ////this.visaService.onQuestionChanged,
                this.visaService.onScreenQuestionChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                ////this.visaService.onQuestionChanged,
                this.visaService.onScreenQuestionChanged,
                this._filterChange
            ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.visaService.screenQuestions != undefined) {
                var data = _this.visaService.screenQuestions.slice();
                data = _this.filterData(data);
                _this.filteredData = data.slice();
                data = _this.sortData(data);
                if (_this.directiveScroll) {
                    _this.directiveScroll.scrollToTop(0, 500);
                    _this.directiveScroll.update();
                }
                var pageindex = _this._paginator != undefined ? _this._paginator.pageIndex : 1;
                var pagesize = _this._paginator != undefined ? _this._paginator.pageSize : 25;
                var startIndex = pageindex * pagesize;
                return data.splice(startIndex, pagesize);
            }
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
        if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'tq_category':
                    _a = [a.category, b.category], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'tq_question':
                    _b = [a.question, b.question], propertyA = _b[0], propertyB = _b[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b;
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
var ConsultantDataSource = /** @class */ (function (_super) {
    __extends(ConsultantDataSource, _super);
    function ConsultantDataSource(visaService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.visaService = visaService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.visaService.consultants != undefined)
            _this.filteredData = _this.visaService.screenQuestions;
        return _this;
    }
    Object.defineProperty(ConsultantDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsultantDataSource.prototype, "filter", {
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
    ConsultantDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [];
        if (this._paginator != undefined)
            displayDataChanges = [
                this.visaService.onConsultantChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.visaService.onConsultantChanged,
                this._filterChange
            ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.visaService.consultants != undefined) {
                var data = _this.visaService.consultants.slice();
                data = _this.filterData(data);
                _this.filteredData = data.slice();
                data = _this.sortData(data);
                if (_this.directiveScroll) {
                    _this.directiveScroll.scrollToTop(0, 500);
                    _this.directiveScroll.update();
                }
                var pageindex = _this._paginator != undefined ? _this._paginator.pageIndex : 1;
                var pagesize = _this._paginator != undefined ? _this._paginator.pageSize : 25;
                var startIndex = pageindex * pagesize;
                return data.splice(startIndex, pagesize);
            }
        });
    };
    ConsultantDataSource.prototype.filterData = function (data) {
        if (!this.filter) {
            return data;
        }
        return fuseUtils_1.FuseUtils.filterArrayByString(data, this.filter);
    };
    ConsultantDataSource.prototype.sortData = function (data) {
        var _this = this;
        if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'vc_name':
                    _a = [a.category, b.category], propertyA = _a[0], propertyB = _a[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a;
        });
    };
    ConsultantDataSource.prototype.disconnect = function () {
    };
    __decorate([
        core_1.ViewChild(fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective)
    ], ConsultantDataSource.prototype, "directiveScroll", void 0);
    return ConsultantDataSource;
}(collections_1.DataSource));
exports.ConsultantDataSource = ConsultantDataSource;
if (1 == 1) {
    /* Code for Old Question functionality
    import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
    import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
    import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
    import { DataSource } from '@angular/cdk/collections';
    import { Router } from '@angular/router';
    import { Observable } from 'rxjs/Observable';
    import { BehaviorSubject } from 'rxjs/BehaviorSubject';
    import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
    import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
    import { fuseAnimations } from '../../../../core/animations';
    import { ProgressBarConfig } from '../../../../app.model';
    import { LoginService } from '../../login/login.service';
    import { SnackBarService } from '../../dialog/snackbar.service'
    import { DialogComponent, DialogDataComponent, DialogConsultantComponent } from '../../dialog/dialog.component'
    import { FuseUtils } from '../../../../core/fuseUtils';
    import { VisaService } from '../visa.service';
    //import { ConsultantComponent } from './consultant.component';
    import { Question, ExternalConsultant } from '../visa.model';
    import { Utilities } from '../../common/commonUtil';
    
    @Component({
        selector: 'visa-question',
        templateUrl: './question.component.html',
        styleUrls: ['../visa.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations
    })
    
    export class QuestionComponent implements OnInit, OnDestroy
    {
        @ViewChild(MatPaginator) paginator: MatPaginator;
        @ViewChild('filter') filter: ElementRef;
        @ViewChild(MatSort) sort: MatSort;
    
        categories = [];
        questions= [];
        dataSource: FilesDataSource | null;
        consultantData: ConsultantDataSource | null;
        confirmDialogComp: MatDialogRef<FuseConfirmDialogComponent>;
        searchInput: FormControl;
        progressbar: ProgressBarConfig;
        questionFormGroup: FormGroup;
        questionForm: Question;
        editQuestion: Question;
        ////displayedColumns = ['tq_category', 'tq_question', 'tq_button'];
        displayedColumns = ['sq_qnumber', 'sq_question', 'sq_qtype', 'sq_button'];
        displayedConsultantColumns = ['vc_name', 'vc_email', 'vc_workstatus', 'vc_currentLocation', 'vc_totalExp', 'vc_button'];
        isFormExpanded: boolean = true;
        isSavable: boolean = false;
        isDisabled: boolean = false;
        isVisible: boolean = true;
    isConsultantLoaded: boolean = false;
    selectedTabIndex: number = 0;
    matTableInner: number;
    
    constructor(
        private router: Router,
        private confirmDialog: MatDialog,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private visaService: VisaService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl('');
        this.questionForm = new Question({});
    }
    
    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_VQuestion();
        this.progressbar = new ProgressBarConfig({});
        this.questionFormGroup = this.createQuestionForm();
        this.dataSource = new FilesDataSource(this.visaService, this.paginator, this.sort);
        this.consultantData = new ConsultantDataSource(this.visaService, this.paginator, this.sort);
    
        this.refresh();
    }
    
    ngOnDestroy() {
    
    }
    
    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    }
    
    refresh()
    {
        this.isConsultantLoaded = false;
        ////this.getCategories();
    
        if (this.loginService.loggedUser.rolename == this.utilities.rn_superuser) {
            ////this.getQuestions();
            this.getScreenQuestions();
            this.isVisible = true;
            this.selectedTabIndex = 0;
        }
        else {
            this.getConsultants();
            this.isVisible = false;
            this.selectedTabIndex = 1;
        }
    
        this.clearForm();
    }
    
    getQuestions() {
        this.visaService.getQuestions().then(response => {
            if (response) {
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }
    
    getCategories() {
        this.categories = [];
        this.visaService.getCategories().then(response => {
            if (response) {
                if (response != null && response != undefined && response.ResultStatus == 1)
                    response["Output"].map(category => {
                        this.categories.push({ "categoryid": category["categoryid"], "name": category["name"] })
                    });
                else
                    this.categories = [];
    
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }
    
    getConsultants()
    {
        this.visaService.getConsultants().then(response => {
            if (response) {
                if (response != null && response != undefined && response.ResultStatus >= 0)
                    this.isConsultantLoaded = true;
    
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }
    
    getScreenQuestions() {
        this.visaService.getScreenQuestions().then(response => {
            debugger;
            if (response) {
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }
    
    onCategoryChange(event) {
        if (event.value != undefined) {
            this.validateForm();
        }
    }
    
    validateForm()
    {
        let form = this.questionFormGroup.getRawValue();
        let oldQuestion = this.editQuestion;
    
        if (form.categoryid == undefined)
            form.categoryid = -1;
        if (oldQuestion == undefined)
            oldQuestion = new Question({});
    
        if ((form.isnew && form.question != "" && form.categoryid > 0) || (form.isedit && (form.question != oldQuestion.question || form.ismandatory != oldQuestion.ismandatory))) {
            this.isSavable = true;
        }
        else
            this.isSavable = false;
    }
    
    clearForm()
    {
        this.questionFormGroup.patchValue(
            {
                questionid: 0,
                categoryid: 0,
                question: '',
                category: '',
                ismandatory: false,
                isnew: true,
                isedit: false
            });
    
        this.questionForm = new Question({});
        this.editQuestion = new Question({});
        this.isDisabled = false;
        this.isSavable = false;
    }
    
    selectedQuestion(question: Question)
    {
        this.questionFormGroup.patchValue(
            {
                questionid: question.questionid,
                categoryid: question.categoryid,
                question: question.question,
                category: question.category,
                ismandatory: question.ismandatory,
                isnew: false,
                isedit: true
            });
    
        this.editQuestion = question;
    
        this.isDisabled = true;
        this.isFormExpanded = true;
    }
    
    saveQuestion()
    {
        this.questionForm = this.questionFormGroup.getRawValue();
        this.progressbar.showProgress();
    
        this.visaService.saveQuestion(this.questionForm).then(response => {
            if (response) {
                if (response['ResultStatus'] == 1) {
                    this.visaService.getQuestions().then(result => {
                    });
                    this.clearForm();
                }
    
                this.progressbar.hideProgress();
                this.snackComp.showSnackBarPost(response, '');
            }
        });
    }
    
    deleteQuestion(question: Question)
    {
        this.confirmDialogComp = this.confirmDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
    
        this.confirmDialogComp.componentInstance.title = this.utilities.questionDeleteConfirmTitle;
        this.confirmDialogComp.componentInstance.confirmMessage = this.utilities.questionDeleteConfirmMessage;
    
        this.confirmDialogComp.afterClosed().subscribe(result => {
            if (result) {
                this.progressbar.showProgress();
                this.visaService.deleteQuestion(question.questionid).then(response => {
                    if (response) {
                        if (response['ResultStatus'] == 1) {
                            this.visaService.getQuestions().then(result => {
                            });
                            this.clearForm();
                        }
    
                        this.progressbar.hideProgress();
                        this.snackComp.showSnackBarPost(response, '');
                    }
                });
            }
            this.confirmDialogComp = null;
        });
    }
    
    selectedTabChange(event)
    {
        if (event.tab.textLabel == 'Questions') {
            this.isFormExpanded = true;
        }
        else if (event.tab.textLabel == this.utilities.tabScreening) {
            if (!this.isConsultantLoaded)
                this.getConsultants();
        }
    }
    
    showDetails(consultant: ExternalConsultant)
    {
        console.log(consultant);
        let dialog = this.dialog.open(DialogConsultantComponent, {
            height: "450px",
            width: "800px",
            data: {
                title: 'Consultant Details',
                consultant: consultant
            }
        });
    
    }
    
        private createQuestionForm() {
        return this.formBuilder.group({
            questionid: [this.questionForm.questionid],
            categoryid: [this.questionForm.categoryid],
            question: [this.questionForm.question],
            category: [this.questionForm.category],
            ismandatory: [this.questionForm.ismandatory],
            isnew: true,
            isedit: false
        });
    }
    
    }
    
    export class FilesDataSource extends DataSource<any>
    {
        @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
        _filterChange = new BehaviorSubject('');
        _filteredDataChange = new BehaviorSubject('');
    
        get filteredData(): any {
            return this._filteredDataChange.value;
        }
    
        set filteredData(value: any) {
            this._filteredDataChange.next(value);
        }
    
        get filter(): string {
            return this._filterChange.value;
        }
    
        set filter(filter: string) {
            this._filterChange.next(filter);
        }
    
        constructor(private visaService: VisaService, private _paginator: MatPaginator, private _sort: MatSort) {
            super();
            if (this.visaService.screenQuestions != undefined)
                this.filteredData = this.visaService.screenQuestions;
        }
        
        connect(): Observable<any[]> {
            var displayDataChanges = [];
    
            if (this._paginator != undefined)
                displayDataChanges = [
                    ////this.visaService.onQuestionChanged,
                    this.visaService.onScreenQuestionChanged,
                    this._paginator.page,
                    this._filterChange,
                    this._sort.sortChange
                ];
            else
                displayDataChanges = [
                    ////this.visaService.onQuestionChanged,
                    this.visaService.onScreenQuestionChanged,
                    this._filterChange
                ];
    
            return Observable.merge(...displayDataChanges).map(() => {
                if (this.visaService.screenQuestions != undefined) {
                    let data = this.visaService.screenQuestions.slice();
    
                    data = this.filterData(data);
                    this.filteredData = [...data];
                    data = this.sortData(data);
    
                    if (this.directiveScroll) {
                        this.directiveScroll.scrollToTop(0, 500);
                        this.directiveScroll.update();
                    }
    
                    var pageindex = this._paginator != undefined ? this._paginator.pageIndex : 1;
                    var pagesize = this._paginator != undefined ? this._paginator.pageSize : 25;
                    const startIndex = pageindex * pagesize;
                    return data.splice(startIndex, pagesize);
                }
            });
        }
    
        filterData(data) {
            if (!this.filter) {
                return data;
            }
            return FuseUtils.filterArrayByString(data, this.filter);
        }
    
        sortData(data): any[] {
            if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
                return data;
            }
    
            return data.sort((a, b) => {
                let propertyA: number | string = '';
                let propertyB: number | string = '';
    
                switch (this._sort.active) {
                    case 'tq_category':
                        [propertyA, propertyB] = [a.category, b.category];
                        break;
                    case 'tq_question':
                        [propertyA, propertyB] = [a.question, b.question];
                        break;
                }
    
                const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
                const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
    
                return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
            });
        }
    
        disconnect() {
        }
    }
    
    export class ConsultantDataSource extends DataSource<any>
    {
        @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
        _filterChange = new BehaviorSubject('');
        _filteredDataChange = new BehaviorSubject('');
    
        get filteredData(): any {
            return this._filteredDataChange.value;
        }
    
        set filteredData(value: any) {
            this._filteredDataChange.next(value);
        }
    
        get filter(): string {
            return this._filterChange.value;
        }
    
        set filter(filter: string) {
            this._filterChange.next(filter);
        }
    
        constructor(private visaService: VisaService, private _paginator: MatPaginator, private _sort: MatSort) {
            super();
            if (this.visaService.consultants != undefined)
                this.filteredData = this.visaService.screenQuestions;
        }
        
        connect(): Observable<any[]> {
            var displayDataChanges = [];
    
            if (this._paginator != undefined)
                displayDataChanges = [
                    this.visaService.onConsultantChanged,
                    this._paginator.page,
                    this._filterChange,
                    this._sort.sortChange
                ];
            else
                displayDataChanges = [
                    this.visaService.onConsultantChanged,
                    this._filterChange
                ];
    
            return Observable.merge(...displayDataChanges).map(() => {
                if (this.visaService.consultants != undefined) {
                    let data = this.visaService.consultants.slice();
    
                    data = this.filterData(data);
                    this.filteredData = [...data];
                    data = this.sortData(data);
    
                    if (this.directiveScroll) {
                        this.directiveScroll.scrollToTop(0, 500);
                        this.directiveScroll.update();
                    }
    
                    var pageindex = this._paginator != undefined ? this._paginator.pageIndex : 1;
                    var pagesize = this._paginator != undefined ? this._paginator.pageSize : 25;
                    const startIndex = pageindex * pagesize;
    
                    return data.splice(startIndex, pagesize);
                }
            });
        }
    
        filterData(data) {
            if (!this.filter) {
                return data;
            }
            return FuseUtils.filterArrayByString(data, this.filter);
        }
    
        sortData(data): any[] {
            if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
                return data;
            }
    
            return data.sort((a, b) => {
                let propertyA: number | string = '';
                let propertyB: number | string = '';
    
                switch (this._sort.active) {
                    case 'vc_name':
                        [propertyA, propertyB] = [a.category, b.category];
                        break;
                    //case 'tq_question':
                    //    [propertyA, propertyB] = [a.question, b.question];
                    //    break;
                }
    
                const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
                const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
    
                return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
            });
        }
    
        disconnect() {
        }
    }
    */
}
