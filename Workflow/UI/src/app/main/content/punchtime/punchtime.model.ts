import { DatePipe } from '@angular/common';

export class InOutTime
{
    punchid: number;
    punchday: string;
    userid: number;
    intime : string;
    outtime: string;
    notes: string;
    isapproved: boolean;
    isnextdayin: boolean;
    isnextdayout: boolean;
    istoday: boolean;
    isabsent: boolean;
    hourday: string;
    totalhourday: string;
  
    constructor(record?)
    {
        var datePipe = new DatePipe("en-US");

        this.punchid = record.punchid || 0;
        this.punchday = record.punchday || '';
        this.userid = record.userid || 0;
        this.intime = datePipe.transform(record.intime, 'MM-dd-yyyy HH:mm aa') || '';
        this.outtime = datePipe.transform(record.outtime, 'MM-dd-yyyy hh:mm aa') || '';
        this.notes = record.notes || '';
        this.isapproved = record.isapproved || false;
        this.isnextdayin = record.isnextdayout || false;
        this.isnextdayout = record.isnextdayout || false;
        this.istoday = record.istoday || false;
        this.isabsent = record.isabsent || false;
        this.hourday = record.hourday || '';
        this.totalhourday = record.totalhourday || '';
    }
}
