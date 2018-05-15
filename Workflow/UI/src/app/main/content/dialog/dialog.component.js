"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var DialogComponent = /** @class */ (function () {
    function DialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    DialogComponent.prototype.onNoClick = function () {
        //console.log('closed')
        this.dialogRef.close();
    };
    DialogComponent = __decorate([
        core_1.Component({
            selector: 'dialog-component',
            templateUrl: 'dialog.component.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], DialogComponent);
    return DialogComponent;
}());
exports.DialogComponent = DialogComponent;
var DialogDataComponent = /** @class */ (function () {
    function DialogDataComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.dropdownSettings = {};
        this.dropdownSettings = {
            groupBy: "roleName",
            maxHeight: '350px',
            searchAutofocus: true,
            singleSelection: false,
            text: "",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: false,
            classes: 'custom_dropdown_tdw',
            badgeShowLimit: 2
        };
    }
    DialogDataComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DialogDataComponent = __decorate([
        core_1.Component({
            selector: 'jobs-load-dialog',
            styleUrls: ['./dialog.component.scss'],
            templateUrl: 'dialog-user.component.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], DialogDataComponent);
    return DialogDataComponent;
}());
exports.DialogDataComponent = DialogDataComponent;
