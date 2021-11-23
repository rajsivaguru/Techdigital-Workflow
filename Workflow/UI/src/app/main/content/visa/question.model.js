"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Question = /** @class */ (function () {
    function Question(question) {
        this.questionid = question.questionid || 0;
        this.categoryid = question.categoryid || 0;
        this.question = question.question || '';
        this.category = question.category || '';
        this.ismandatory = question.ismandatory || 0;
    }
    return Question;
}());
exports.Question = Question;
