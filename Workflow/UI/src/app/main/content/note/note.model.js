"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoteQuestion = /** @class */ (function () {
    function NoteQuestion(question) {
        this.questionid = question.questionid || 0;
        this.question = question.question || '';
        this.questiontype = question.questiontype || '';
        this.response = question.response || '0';
        this.options = question.options || [];
        this.selectedoptions = question.selectedoptions || [];
        this.maxrate = question.maxrate || [];
    }
    return NoteQuestion;
}());
exports.NoteQuestion = NoteQuestion;
