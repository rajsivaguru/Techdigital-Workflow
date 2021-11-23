"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var fuseUtils_1 = require("../../../core/fuseUtils");
var visa_model_1 = require("./visa.model");
var headers = new http_1.HttpHeaders();
headers.set("Content-Type", "application/json");
var VisaService = /** @class */ (function () {
    function VisaService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onQuestionChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onConsultantChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onScreenQuestionChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.serviceURL = configSer.ServiceURL;
        ////this.screeningQuestions = [];
        this.screening = new visa_model_1.ScreenedProcess({});
        this.recruiterSelectedJob = [];
    }
    VisaService.prototype.ngOnInit = function () {
    };
    VisaService.prototype.resolve = function (route, state) {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
    };
    VisaService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    VisaService.prototype.getCategories = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Visa/GetCategories')
                .subscribe(function (response) {
                resolve(response);
            }, reject);
        });
    };
    VisaService.prototype.getQuestions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Visa/GetQuestions')
                .subscribe(function (response) {
                if (response != null && response != undefined && response.ResultStatus >= 0) {
                    _this.questions = response.Output;
                    if (_this.searchText && _this.searchText !== '') {
                        _this.questions = fuseUtils_1.FuseUtils.filterArrayByString(_this.questions, _this.searchText);
                    }
                    if (_this.questions.length > 0) {
                        _this.questions = _this.questions.map(function (question) {
                            return new visa_model_1.Question(question);
                        });
                    }
                    _this.onQuestionChanged.next(_this.questions);
                    resolve(_this.questions);
                }
                else {
                    resolve(response);
                }
            }, reject);
        });
    };
    VisaService.prototype.getConsultants = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Visa/GetExternalConsultants')
                .subscribe(function (response) {
                if (response != null && response != undefined && response.ResultStatus >= 0) {
                    _this.consultants = response.Output;
                    if (_this.searchText && _this.searchText !== '') {
                        _this.consultants = fuseUtils_1.FuseUtils.filterArrayByString(_this.consultants, _this.searchText);
                    }
                    if (_this.consultants.length > 0) {
                        _this.consultants = _this.consultants.map(function (consultant) {
                            return new visa_model_1.ExternalConsultant(consultant);
                        });
                    }
                    _this.onConsultantChanged.next(_this.consultants);
                    resolve(response);
                }
                else {
                    resolve(response);
                }
            }, reject);
        });
    };
    VisaService.prototype.getScreenQuestions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Visa/GetScreenQuestions')
                .subscribe(function (response) {
                if (response != null && response != undefined && response.ResultStatus >= 0) {
                    _this.screenQuestions = response.Output;
                    if (_this.searchText && _this.searchText !== '') {
                        _this.screenQuestions = fuseUtils_1.FuseUtils.filterArrayByString(_this.screenQuestions, _this.searchText);
                    }
                    if (_this.screenQuestions.length > 0) {
                        _this.screenQuestions = _this.screenQuestions.map(function (question) {
                            return new visa_model_1.ScreenQuestion(question);
                        });
                    }
                    _this.onScreenQuestionChanged.next(_this.screenQuestions);
                    resolve(_this.screenQuestions);
                }
                else {
                    resolve(response);
                }
            }, reject);
        });
    };
    VisaService.prototype.deleteQuestion = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Visa/DeleteQuestion?questionId=' + id + '&loginId=' + _this.loggedUserId, { headers: headers })
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    VisaService.prototype.saveQuestion = function (question) {
        var _this = this;
        question.loginid = this.loggedUserId;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Visa/SaveQuestion', question, { headers: headers })
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    VisaService.prototype.saveScreenQuestion = function (question) {
        var _this = this;
        question.loginid = this.loggedUserId;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Visa/SaveScreenQuestion', question, { headers: headers })
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    VisaService.prototype.saveScreening = function (screening) {
        var _this = this;
        screening.loginid = this.loggedUserId;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Visa/SaveScreening', screening, { headers: headers })
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    VisaService = __decorate([
        core_1.Injectable()
    ], VisaService);
    return VisaService;
}());
exports.VisaService = VisaService;
