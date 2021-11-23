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
var animations_1 = require("../../../core/animations");
var app_model_1 = require("../../../app.model");
var dialog_component_1 = require("../dialog/dialog.component");
var NoteFormComponent = /** @class */ (function () {
    function NoteFormComponent(dialog, confirmDialog, noteService, router, formBuilder, loginService, snackComp, utilities) {
        this.dialog = dialog;
        this.confirmDialog = confirmDialog;
        this.noteService = noteService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.datePipe = new common_1.DatePipe("en-US");
        this.questionList = [];
        this.todayDate = new Date();
        this.maxFromDate = null;
        this.canPreview = false;
        this.searchInput = new forms_1.FormControl('');
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
    }
    NoteFormComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.getQuestionList();
    };
    NoteFormComponent.prototype.ngOnDestroy = function () {
    };
    NoteFormComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    NoteFormComponent.prototype.openModal = function (question, optionlist, selectedusers) {
        var options = [];
        optionlist.forEach(function (item) {
            options.push({ "id": item.optionid, "itemName": item.option });
        });
        var dialogUserList = this.dialog.open(dialog_component_1.DialogDataComponent, {
            height: "550px",
            width: "400px",
            data: {
                title: 'Select Options',
                userList: options,
                selectedUsers: selectedusers,
                groupByField: ''
            }
        });
        dialogUserList.afterClosed().subscribe(function (result) {
            if (result == undefined) {
                //question.response = '';
            }
            else if (result.length > 0) {
                question.response = '';
                question.selectedoptions = result;
                result.forEach(function (item) {
                    question.response += item.itemName + ', ';
                });
                if (question.response.endsWith(', ')) {
                    question.response = question.response.substr(0, question.response.trim().length - 1);
                }
            }
            else {
                question.selectedoptions = [];
                question.response = '';
            }
        });
    };
    NoteFormComponent.prototype.rating = function (question, index) {
        if (index == question.response)
            question.response = 0;
        else
            question.response = index;
    };
    NoteFormComponent.prototype.clearForm = function () {
        this.questionList.forEach(function (x) {
            if (x.type == 'Rating')
                x.response = 0;
            else
                x.response = '';
        });
    };
    NoteFormComponent.prototype.copyToClipboard = function () {
        var textarea = document.createElement('textarea');
        textarea.textContent = document.getElementById('divForm').innerText;
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
    NoteFormComponent.prototype.getQuestionList = function () {
        var _this = this;
        this.noteService.getQuestionList().then(function (response) {
            if (response) {
                _this.questionList = response;
            }
        });
    };
    /*Not Used. */
    NoteFormComponent.prototype.dateChanged = function (question) {
        question.response = this.datePipe.transform(question.response, 'MM/dd/yyyy');
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], NoteFormComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], NoteFormComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], NoteFormComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], NoteFormComponent.prototype, "sort", void 0);
    NoteFormComponent = __decorate([
        core_1.Component({
            selector: 'note-from',
            templateUrl: './note-form.component.html',
            //styleUrls: ['./jobs-client.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], NoteFormComponent);
    return NoteFormComponent;
}());
exports.NoteFormComponent = NoteFormComponent;
