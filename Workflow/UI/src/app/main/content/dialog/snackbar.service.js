"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SnackBarService = /** @class */ (function () {
    function SnackBarService(snackBar) {
        this.snackBar = snackBar;
    }
    SnackBarService.prototype.showUnfinishedSnackBar = function (message) {
        this.showUnfinished(message, '');
    };
    SnackBarService.prototype.showSimpleNotificationSnackBar = function (message) {
        this.showNotification(message, '');
    };
    SnackBarService.prototype.showSimpleSnackBar = function (message) {
        this.showSuccess(message, '');
    };
    SnackBarService.prototype.showSimpleWarning = function (message) {
        this.showWarning(message, '');
    };
    SnackBarService.prototype.showSnackBar = function (status, message, action) {
        if (status == "1")
            this.showSuccess(message, action);
        else
            this.showError(message, action);
    };
    SnackBarService.prototype.showSnackBarGet = function (response, action) {
        if (response["ResultStatus"] == "-1" || response["ResultStatus"] == "-2" || response["ResultStatus"] == "-3")
            this.showError(response["ErrorMessage"], action);
    };
    SnackBarService.prototype.showSnackBarPost = function (response, action) {
        if (response["ResultStatus"] == "1")
            this.showSuccess(response["SuccessMessage"], action);
        else if (response["ResultStatus"] == "-2")
            this.showWarning(response["ErrorMessage"], action);
        else
            this.showError(response["ErrorMessage"] != undefined ? response["ErrorMessage"] :
                response["Message"] != undefined && response["Message"].indexOf('No HTTP') >= 0 ? 'Valid API method is not found.' : response["Message"], action);
    };
    SnackBarService.prototype.showNotification = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 7000,
            verticalPosition: 'top',
            extraClasses: ['snackbar-notification']
        });
    };
    SnackBarService.prototype.showSuccess = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-success']
        });
    };
    SnackBarService.prototype.showError = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 7000,
            verticalPosition: 'top',
            extraClasses: ['snackbar-error']
        });
    };
    SnackBarService.prototype.showWarning = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-warning']
        });
    };
    SnackBarService.prototype.showUnfinished = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-unfinished']
        });
    };
    SnackBarService = __decorate([
        core_1.Injectable()
    ], SnackBarService);
    return SnackBarService;
}());
exports.SnackBarService = SnackBarService;
