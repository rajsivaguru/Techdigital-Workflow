import { DatePipe } from '@angular/common';

export class NoteQuestion
{
    questionid: number;
    question: string;
    questiontype: string;    
    response: string;
    options: string[];
    selectedoptions: string[];
    maxrate: number [];

    constructor(question?) {
        this.questionid = question.questionid || 0;
        this.question = question.question || '';
        this.questiontype = question.questiontype || '';
        this.response = question.response || '0';
        this.options = question.options || [];
        this.selectedoptions = question.selectedoptions || [];
        this.maxrate = question.maxrate || [];
    }
}
