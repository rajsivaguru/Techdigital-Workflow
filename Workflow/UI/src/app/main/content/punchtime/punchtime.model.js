"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var InOutTime = /** @class */ (function () {
    function InOutTime(record) {
        var datePipe = new common_1.DatePipe("en-US");
        this.punchid = record.punchid || 0;
        this.punchday = record.punchday || '';
        this.userid = record.userid || 0;
        this.intime = datePipe.transform(record.intime, 'MM-dd-yyyy hh:mm aa') || '';
        this.outtime = datePipe.transform(record.outtime, 'MM-dd-yyyy hh:mm aa') || '';
        this.notes = record.notes || '';
        this.istoday = record.istoday || false;
    }
    return InOutTime;
}());
exports.InOutTime = InOutTime;
