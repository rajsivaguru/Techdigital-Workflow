"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
var FuseCountdownComponent = /** @class */ (function () {
    function FuseCountdownComponent() {
        this.countdown = {
            days: '',
            hours: '',
            minutes: '',
            seconds: ''
        };
    }
    FuseCountdownComponent.prototype.ngOnInit = function () {
        var _this = this;
        var currDate = moment();
        var eventDate = moment(this.eventDate);
        var diff = eventDate.diff(currDate, 'seconds');
        var countDown = Observable_1.Observable
            .interval(1000)
            .map(function (value) {
            return diff = diff - 1;
        })
            .map(function (value) {
            var timeLeft = moment.duration(value, 'seconds');
            return {
                days: timeLeft.asDays().toFixed(0),
                hours: timeLeft.hours(),
                minutes: timeLeft.minutes(),
                seconds: timeLeft.seconds()
            };
        });
        countDown.subscribe(function (value) {
            _this.countdown = value;
        });
    };
    __decorate([
        core_1.Input('eventDate')
    ], FuseCountdownComponent.prototype, "eventDate", void 0);
    FuseCountdownComponent = __decorate([
        core_1.Component({
            selector: 'fuse-countdown',
            templateUrl: './countdown.component.html',
            styleUrls: ['./countdown.component.scss']
        })
    ], FuseCountdownComponent);
    return FuseCountdownComponent;
}());
exports.FuseCountdownComponent = FuseCountdownComponent;
