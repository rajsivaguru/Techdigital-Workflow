import { FuseUtils } from '../../../core/fuseUtils';
import { DatePipe } from '@angular/common';

export class ComposeEmail {
    userid: string;
    jobid: number;
    formattedjob: string;
    subject: string;
    body: string;
    usedefaultfromaddress: boolean;
    sendseperateemail: boolean;
    fromaddress: string;
    toaddresses: string[];
    ccaddresses: string[];
    bccaddresses: string[];
    emailtypeid: number;

    constructor(criteria) {
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
}

export class EmailDetails {
    emailtypeid: number;
    name: string;
    description: string;
    todetails: ToEmailDetails[];

    constructor(detail) {
        this.emailtypeid = detail.emailtypeid || null;
        this.name = detail.name || '';
        this.description = detail.description || '';
        this.todetails = detail.todetails || [];
    }
}

export class ToEmailDetails {
    emaildetailsid: number;
    emailtypeid: number;
    toaddress: string;

    constructor(detail) {
        this.emaildetailsid = detail.emaildetailsid || null;
        this.emailtypeid = detail.emailtypeid || null;
        this.toaddress = detail.toaddress || '';
    }
}

