"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComposeEmail = /** @class */ (function () {
    function ComposeEmail(criteria) {
        this.userid = criteria.userid || null;
        this.jobid = criteria.jobid || null;
        this.formattedjob = criteria.formattedjob || '';
        this.subject = criteria.subject || '';
        this.body = criteria.body || '';
        this.fromaddress = criteria.fromaddress || '';
        this.toaddresses = criteria.toaddresses || [];
        this.ccaddresses = criteria.ccaddresses || [];
        this.bccaddresses = criteria.bccaddresses || [];
        this.usedefaultfromaddress = criteria.usedefaultfromaddress || true;
        this.sendseperateemail = criteria.sendseperateemail || true;
        this.emailtypeid = criteria.emailtypeid || 0;
    }
    return ComposeEmail;
}());
exports.ComposeEmail = ComposeEmail;
var EmailDetails = /** @class */ (function () {
    function EmailDetails(detail) {
        this.emailtypeid = detail.emailtypeid || null;
        this.name = detail.name || '';
        this.description = detail.description || '';
        this.todetails = detail.todetails || [];
    }
    return EmailDetails;
}());
exports.EmailDetails = EmailDetails;
var ToEmailDetails = /** @class */ (function () {
    function ToEmailDetails(detail) {
        this.emaildetailsid = detail.emaildetailsid || null;
        this.emailtypeid = detail.emailtypeid || null;
        this.toaddress = detail.toaddress || '';
    }
    return ToEmailDetails;
}());
exports.ToEmailDetails = ToEmailDetails;
