"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseMatchMedia = /** @class */ (function () {
    function FuseMatchMedia(observableMedia) {
        var _this = this;
        this.observableMedia = observableMedia;
        this.onMediaChange = new core_1.EventEmitter();
        this.activeMediaQuery = '';
        this.observableMedia.subscribe(function (change) {
            if (_this.activeMediaQuery !== change.mqAlias) {
                _this.activeMediaQuery = change.mqAlias;
                _this.onMediaChange.emit(change.mqAlias);
            }
        });
    }
    FuseMatchMedia = __decorate([
        core_1.Injectable()
    ], FuseMatchMedia);
    return FuseMatchMedia;
}());
exports.FuseMatchMedia = FuseMatchMedia;
