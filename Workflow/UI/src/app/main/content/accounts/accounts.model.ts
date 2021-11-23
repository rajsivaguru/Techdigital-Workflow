import { DatePipe } from '@angular/common';

export class EmploymentType
{
    employmenttypeid: number;
    code: string;
    description: string;
    sortorder: number;

    constructor(employmenttype?)
    {
        this.employmenttypeid = employmenttype.employmenttypeid || 0;
        this.code = employmenttype.code || '';
        this.description = employmenttype.description || '';
        this.sortorder = employmenttype.sortorder || 0;
    }
}

export class CommunicationMode
{
    communicationid: number;
    mode: string;
    description: string;
    sortorder: number;

    constructor(communicationmode?) {
        this.communicationid = communicationmode.communicationid || 0;
        this.mode = communicationmode.mode || '';
        this.description = communicationmode.description || '';
        this.sortorder = communicationmode.sortorder || 0;
    }
}

export class BillingFrequency
{
    billingfrequencyid: number;
    frequency: string;
    description: string;
    sortorder: number;

    constructor(billingfrequency?) {
        this.billingfrequencyid = billingfrequency.billingfrequencyid || 0;
        this.frequency = billingfrequency.frequency || '';
        this.description = billingfrequency.description || '';
        this.sortorder = billingfrequency.sortorder || 0;
    }
}

export class CustomerVendor {
    customervendorid: number;
    name: string;
    type: string;

    constructor(customer?) {
        this.customervendorid = customer.customervendorid || 0;
        this.name = customer.name || '';
        this.type = customer.type || '';
    }
}

export class InvoiceSupportingDetail
{
    employmenttypes: EmploymentType[];
    communicationmodes: CommunicationMode[];
    billingfrequencies: BillingFrequency[];
    customervendors: CustomerVendor[];

    constructor(detail?) {
        this.employmenttypes = detail.employmenttypes || [];
        this.communicationmodes = detail.communicationmodes || [];
        this.billingfrequencies = detail.billingfrequencies || [];
        this.customervendors = detail.customervendors || [];
    }
}

export class Consultant
{
    consultantid: number;
    employmenttypeid: number;
    billingfrequencyid: number;
    communicationid: number;
    code: string;
    billingfrequency: string;
    mode: string;
    firstname: string;
    middlename: string;
    lastname: string;
    fullname: string;
    email: string;
    phone: string;
    customer: string;
    endclient: string;
    billpayto: string;
    invoicestartdate: Date;
    startdate: Date;
    enddate: Date;
    billrate: number;
    payrate: number;
    commissionrate: number;
    commissionto: string;
    invoiceemail: string;
    portalurl: string;
    portaluser: string;
    portalpwd: string;
    portalnotes: string;
    
    constructor(consultant?)
    {
        var datePipe = new DatePipe("en-US");

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
        this.billpayto = consultant.billpayto || '';
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
}

export class Invoice {
    invoiceid: number;
    timesheetinvoicestatusdetailid: number;
    statusid: number;
    name: string;
    customer: string;
    endclient: string;
    billpayto: string;
    employmenttype: string;
    frequency: string;
    isw2: boolean; 
    hascommission: boolean; 
    shouldsendinvoice: boolean; 
    invoicestartdate: Date;
    invoiceenddate: Date;    
    tsexpectedhours: string;
    tsactualhours: number;
    status: string;
    statussortorder: number;
    tsreceiveddate: Date;
    tsverifieddate: Date;
    tsnotes: string;
    invoicecreateddate: Date;
    invoicenumber: string;
    invoiceamount: number;
    invoicenotes: string;
    invoicesentdate: Date;
    invoicesentnotes: string;
    paymentreceiveddate: Date;
    paymentamount: number;
    ispartialpayment: boolean;
    paymentnotes: string;
    paymenthistory: PaymentHistory[];
    billpaiddate : Date;
    billamount: number;
    billhours: number;
    billnotes: string;
    commissionpaiddate: Date;
    commissionamount: number;
    commissionhours: number;
    commissionnotes: string;
    completepercent: number;

    constructor(invoice?) {
        var datePipe = new DatePipe("en-US");

        this.invoiceid = invoice.invoiceid || 0;
        this.timesheetinvoicestatusdetailid = invoice.timesheetinvoicestatusdetailid || 0;
        this.statusid = invoice.statusid || 0;
        this.name = invoice.name || '';
        this.customer = invoice.customer || '';
        this.endclient = invoice.endclient || '';
        this.billpayto = invoice.billpayto || '';
        this.employmenttype = invoice.employmenttype || '';
        this.frequency = invoice.frequency || '';
        this.isw2 = invoice.isw2 || false;
        this.hascommission = invoice.hascommission || false;
        this.shouldsendinvoice = invoice.shouldsendinvoice || false;
        this.invoicestartdate = invoice.invoicestartdate || '';
        this.invoiceenddate = invoice.invoiceenddate || '';
        this.tsexpectedhours = invoice.tsexpectedhours || '';
        this.tsactualhours = invoice.tsactualhours || '';
        this.status = invoice.status || '';
        this.statussortorder = invoice.statussortorder || 0;
        this.tsreceiveddate = invoice.tsreceiveddate || '';
        this.tsverifieddate = invoice.tsverifieddate || '';
        this.tsnotes = invoice.tsnotes || '';
        this.invoicecreateddate = invoice.invoicecreateddate || '';
        this.invoicenumber = invoice.invoicenumber || '';
        this.invoiceamount = invoice.invoiceamount || '';
        this.invoicenotes = invoice.invoicenotes || '';
        this.invoicesentdate = invoice.invoicesentdate || '';
        this.invoicesentnotes = invoice.invoicesentnotes || '';
        this.paymentreceiveddate = invoice.paymentreceiveddate || '';
        this.paymentamount = invoice.paymentamount || '';
        this.ispartialpayment = invoice.ispartialpayment || false; 
        this.paymentnotes = invoice.paymentnotes || '';
        this.paymenthistory = invoice.paymenthistory || [];
        this.billpaiddate = invoice.billpaiddate || '';
        this.billamount = invoice.billamount || '';
        this.billhours = invoice.billhours || '';
        this.billnotes = invoice.billnotes || '';
        this.commissionpaiddate = invoice.commissionpaiddate || '';
        this.commissionamount = invoice.commissionamount || '';
        this.commissionhours = invoice.commissionhours || '';
        this.commissionnotes = invoice.commissionnotes || '';
        this.completepercent = invoice.completepercent || 0;
    }
}

export class PaymentHistory {
    paymentreceiveddate: Date;
    paymentamount: number;
    ispartialpayment: boolean;
    paymentnotes: string;

    constructor(history?) {
        this.paymentreceiveddate = history.paymentreceiveddate || '';
        this.paymentamount = history.paymentamount || '';
        this.ispartialpayment = history.ispartialpayment || false;
        this.paymentnotes = history.paymentnotes || '';
    }
}