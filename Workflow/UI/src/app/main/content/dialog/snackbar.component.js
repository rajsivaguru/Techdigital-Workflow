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
    SnackBarService.prototype.openSuccessSnackBar = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-blue-100-bg']
        });
    };
    SnackBarService.prototype.openErrorSnackBar = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-red-100-bg']
        });
    };
    SnackBarService = __decorate([
        core_1.Injectable()
    ], SnackBarService);
    return SnackBarService;
}());
exports.SnackBarService = SnackBarService;
