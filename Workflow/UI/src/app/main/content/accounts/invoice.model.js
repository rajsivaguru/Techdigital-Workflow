"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var EmploymentType = /** @class */ (function () {
    function EmploymentType(employmenttype) {
        this.employmenttypeid = employmenttype.employmenttypeid || 0;
        this.code = employmenttype.code || '';
        this.description = employmenttype.description || '';
        this.sortorder = employmenttype.sortorder || 0;
    }
    return EmploymentType;
}());
exports.EmploymentType = EmploymentType;
var CommunicationMode = /** @class */ (function () {
    function CommunicationMode(communicationmode) {
        this.communicationid = communicationmode.communicationid || 0;
        this.mode = communicationmode.mode || '';
        this.description = communicationmode.description || '';
        this.sortorder = communicationmode.sortorder || 0;
    }
    return CommunicationMode;
}());
exports.CommunicationMode = CommunicationMode;
var BillingFrequency = /** @class */ (function () {
    function BillingFrequency(billingfrequency) {
        this.billingfrequencyid = billingfrequency.billingfrequencyid || 0;
        this.frequency = billingfrequency.frequency || '';
        this.description = billingfrequency.description || '';
        this.sortorder = billingfrequency.sortorder || 0;
    }
    return BillingFrequency;
}());
exports.BillingFrequency = BillingFrequency;
var InvoiceSupportingDetail = /** @class */ (function () {
    function InvoiceSupportingDetail(detail) {
        this.employmenttypes = detail.employmenttypes || [];
        this.communicationmodes = detail.communicationmodes || [];
        this.billingfrequencies = detail.billingfrequencies || [];
    }
    return InvoiceSupportingDetail;
}());
exports.InvoiceSupportingDetail = InvoiceSupportingDetail;
var Consultant = /** @class */ (function () {
    function Consultant(consultant) {
        var datePipe = new common_1.DatePipe("en-US");
        this.consultantid = consultant.consultantid || 0;
        this.employmenttypeid = consultant.employmenttypeid || 0;
        this.billingfrequencyid = consultant.billingfrequencyid || 0;
        this.communicationid = consultant.communicationid || 0;
        this.code = consultant.code || '';
        this.billingfrequency = consultant.billingfrequency || '';
        this.mode = consultant.mode || '';
        this.firstname = consultant.firstname || '';
        this.middlename = consultant.middlename || '';
        this.lastname = consultant.lastname || '';
        this.fullname = consultant.fullname || '';
        this.email = consultant.email || '';
        this.phone = consultant.phone || '';
        this.customer = consultant.customer || '';
        this.endclient = consultant.endclient || '';
        //this.invoicestartdate = datePipe.transform(consultant.invoicestartdate, 'MM-dd-yyyy') || '';
        //this.startdate = datePipe.transform(consultant.startdate, 'MM-dd-yyyy hh:mm aa') || '';
        //this.enddate = datePipe.transform(consultant.enddate, 'MM-dd-yyyy') || '';
        this.invoicestartdate = consultant.invoicestartdate || '';
        this.startdate = consultant.startdate || '';
        this.enddate = consultant.enddate || '';
        this.billrate = consultant.billrate || '';
        this.payrate = consultant.payrate || '';
        this.commissionrate = consultant.commissionrate || '';
        this.commissionto = consultant.commissionto || '';
        this.invoiceemail = consultant.invoiceemail || '';
        this.portalurl = consultant.portalurl || '';
        this.portaluser = consultant.portaluser || '';
        this.portalpwd = consultant.portalpwd || '';
        this.portalnotes = consultant.portalnotes || '';
    }
    return Consultant;
}());
exports.Consultant = Consultant;
var Invoice = /** @class */ (function () {
    function Invoice(invoice) {
        var datePipe = new common_1.DatePipe("en-US");
        this.invoiceid = invoice.invoiceid || 0;
        this.timesheetinvoicestatusdetailid = invoice.timesheetinvoicestatusdetailid || 0;
        this.name = invoice.name || '';
        this.customer = invoice.customer || '';
        this.endclient = invoice.endclient || '';
        this.invoicestartdate = invoice.invoicestartdate || '';
        this.invoiceenddate = datePipe.transform(invoice.invoiceenddate, 'MM/dd/yyyy') || '';
        this.tsexpectedhours = invoice.tsexpectedhours || '';
        this.tsactualhours = invoice.tsactualhours || '';
        this.status = invoice.status || '';
    }
    return Invoice;
}());
exports.Invoice = Invoice;
