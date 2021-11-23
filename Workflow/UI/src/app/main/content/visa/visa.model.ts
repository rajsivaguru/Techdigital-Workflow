import { DatePipe } from '@angular/common';

export class Category
{
    categoryid: number;
    name: string;
    description: string;

    constructor(category?) {
        this.categoryid = category.categoryid || 0;
        this.name = category.name || '';
        this.description = category.description || '';
    }
}

export class Question
{
    questionid: number;
    categoryid: number;
    question: string;
    category: string;
    ismandatory: boolean;
    loginid: string;

    constructor(question?) {
        this.questionid = question.questionid || 0;
        this.categoryid = question.categoryid || 0;
        this.question = question.question || '';
        this.category = question.category || '';
        this.ismandatory = question.ismandatory || false;
    }
}

export class ExternalConsultant
{
    consultantid: number;
    name: string;
    email: string;
    contactnumber: string;
    workauthorization: string;
    totalexperience: string;
    relevantexperience: string;
    technology: string;
    currentlocation: string;
    canrelocate: boolean;
    inproject: boolean;
    noticeperiod: string;
    education: string;
    certification: string;
    identificationtype: string;
    identificationid: string;
    additionalinfo: string;
    createdby: string;
    createdon: string;
    updatedby: string;
    updatedon: string;

    constructor(consultant?)
    {
        var datePipe = new DatePipe("en-US");

        this.consultantid = consultant.consultantid || 0;
        this.name = consultant.name || '';
        this.email = consultant.email || '';
        this.contactnumber = consultant.contactnumber || '';
        this.workauthorization = consultant.workauthorization || '';
        this.totalexperience = consultant.totalexperience || '';
        this.relevantexperience = consultant.relevantexperience || '';
        this.technology = consultant.technology || '';
        this.currentlocation = consultant.currentlocation || '';
        this.canrelocate = consultant.canrelocate || false;
        this.inproject = consultant.inproject || false;
        this.noticeperiod = consultant.noticeperiod || '';
        this.education = consultant.education || '';
        this.certification = consultant.certification || '';
        this.identificationtype = consultant.identificationtype || '';
        this.identificationid = consultant.identificationid || '';
        this.additionalinfo = consultant.additionalinfo || '';
        this.createdby = consultant.createdby || '';
        this.createdon = datePipe.transform(consultant.createdon, 'MM-dd-yyyy hh:mm aa') || '';
        this.updatedby = consultant.updatedby || '';
        this.updatedon = datePipe.transform(consultant.updatedon, 'MM-dd-yyyy hh:mm aa') || '';
    }
}

export class ScreenQuestion {
    questionid: number;
    parentquestionid: number;
    questionnumber: string;
    question: string;
    questiontype: string;
    hint: string;
    showNA: boolean;
    ismandatory: boolean;
    isparent: boolean;
    sortorder: number;
    loginid: string;
    options: ScreenOption[];
    option: string;
    optionna: boolean;
    optionaction: string;

    constructor(question?) {
        this.questionid = question.questionid || 0;
        this.parentquestionid = question.parentquestionid || 0;
        this.questionnumber = question.questionnumber || '';
        this.question = question.question || '';
        this.questiontype = question.questiontype || '';
        this.hint = question.hint || '';
        this.showNA = question.showNA || false;
        this.ismandatory = question.ismandatory || false;
        this.isparent = question.isparent || false;
        this.sortorder = question.sortorder || 0;
        this.options = question.options || [];
        this.option = question.option || '';
        this.optionna = question.optionna || false;
        this.optionaction = question.optionaction || '';
    }
}

export class ScreenOption {
    optionid: number;
    questionid: number;
    option: string;
    questionnumber: string;
    question: string;
    optionaction: string;
    isNA: boolean;
    sortorder: number;

    constructor(options?) {
        this.optionid = options.optionid || 0;
        this.questionid = options.questionid || 0;
        this.option = options.option || '';
        this.optionaction = options.optionaction || '';
        this.isNA = options.isNA || false;
        this.sortorder = options.sortorder || 0;
    }
}

export class ScreenedProcess
{
    screenprocessid: number;    
    firstname: string;
    lastname: string;
    currentlocation: string;
    email: string;
    phone: string;
    jobid: string;
    jobcode: string;
    jobtitle: string;
    joblocation: string;
    endreason: string;
    isterminated: boolean;
    loginid: string;
    starttime: string;
    endtime: string;
    questions: ScreenQuestion[];

    constructor(screening?)
    {
        this.screenprocessid = screening.screenprocessid || 0;
        this.firstname = screening.firstname || '';
        this.lastname = screening.lastname || '';
        this.currentlocation = screening.currentlocation || '';
        this.email = screening.email || '';
        this.phone = screening.phone || '';
        this.jobid = screening.jobid || '';
        this.jobcode = screening.jobcode || '';
        this.jobtitle = screening.jobtitle || '';
        this.joblocation = screening.joblocation || '';
        this.endreason = screening.endreason || '';
        this.isterminated = screening.isterminated || false;
        this.starttime = screening.starttime || '';
        this.endtime = screening.endtime || '';
        this.questions = screening.questions || [];
    }
}