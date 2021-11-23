import { DatePipe } from '@angular/common';

export class InOutTime
{
    punchid: number;
    punchday: string;
    userid: number;
    intime : string;
    outtime: string;
    notes: string;
    istoday: boolean;
  
    constructor(record?)
    {
        var datePipe = new DatePipe("en-US");

        this.punchid = record.punchid || 0;
        this.punchday = record.punchday || '';
        this.userid = record.userid || 0;
        this.intime = datePipe.transform(record.intime, 'MM-dd-yyyy hh:mm aa') || '';
        this.outtime = datePipe.transform(record.outtime, 'MM-dd-yyyy hh:mm aa') || '';
        this.notes = record.notes || '';
        this.istoday = record.istoday || false;
    }
}
