"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var Notification = /** @class */ (function () {
    function Notification(notification) {
        var datePipe = new common_1.DatePipe("en-US");
        this.notificationid = notification.notificationid || 0;
        this.notificationtype = notification.notificationtype || '';
        this.fromuser = notification.fromuser || '';
        this.jobid = notification.jobid || 0;
        this.referenceid = notification.referenceid || '';
        this.title = notification.title || '';
        this.messagetext = notification.messagetext || '';
        this.isread = notification.isread || false;
        this.createdon = datePipe.transform(notification.createdon, 'MM/dd/yyyy hh:mm aa') || '';
    }
    return Notification;
}());
exports.Notification = Notification;
