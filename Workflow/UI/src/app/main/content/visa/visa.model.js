"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var Category = /** @class */ (function () {
    function Category(category) {
        this.categoryid = category.categoryid || 0;
        this.name = category.name || '';
        this.description = category.description || '';
    }
    return Category;
}());
exports.Category = Category;
var Question = /** @class */ (function () {
    function Question(question) {
        this.questionid = question.questionid || 0;
        this.categoryid = question.categoryid || 0;
        this.question = question.question || '';
        this.category = question.category || '';
        this.ismandatory = question.ismandatory || false;
    }
    return Question;
}());
exports.Question = Question;
var ExternalConsultant = /** @class */ (function () {
    function ExternalConsultant(consultant) {
        var datePipe = new common_1.DatePipe("en-US");
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
    return ExternalConsultant;
}());
exports.ExternalConsultant = ExternalConsultant;
var ScreenQuestion = /** @class */ (function () {
    function ScreenQuestion(question) {
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
    return ScreenQuestion;
}());
exports.ScreenQuestion = ScreenQuestion;
var ScreenOption = /** @class */ (function () {
    function ScreenOption(options) {
        this.optionid = options.optionid || 0;
        this.questionid = options.questionid || 0;
        this.option = options.option || '';
        this.optionaction = options.optionaction || '';
        this.isNA = options.isNA || false;
        this.sortorder = options.sortorder || 0;
    }
    return ScreenOption;
}());
exports.ScreenOption = ScreenOption;
var ScreenedProcess = /** @class */ (function () {
    function ScreenedProcess(screening) {
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
    return ScreenedProcess;
}());
exports.ScreenedProcess = ScreenedProcess;
