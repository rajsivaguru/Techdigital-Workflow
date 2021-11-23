import { FuseUtils } from '../../core/fuseUtils';
import { DatePipe } from '@angular/common';

export class Notification {
    notificationid: number;
    notificationtype: string;
    fromuser: string;
    jobid: number;
    referenceid: string;
    title: string;
    messagetext: string;
    isread: boolean;
    createdon: string;

    constructor(notification) {
        var datePipe = new DatePipe("en-US");

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
}