import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfigService } from '../../../core/services/config.service';
import { FuseUtils } from '../../../core/fuseUtils';
import { LoginService } from '../login/login.service';
import { Category, Question, ExternalConsultant, ScreenQuestion, ScreenedProcess } from './visa.model';

let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class VisaService
{
    onQuestionChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onConsultantChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onScreenQuestionChanged: BehaviorSubject<any> = new BehaviorSubject({});

    questions: Question[];
    categories: Category[];
    consultants: ExternalConsultant[];
    screenQuestions: ScreenQuestion[];
    ////screeningQuestions: ScreenQuestion[];
    screening: ScreenedProcess;

    serviceURL: String;
    searchText: string;
    loggedUserId: string;
    recruiterSelectedJob: any[];

    constructor(private http: HttpClient, private configSer: FuseConfigService, private loginService: LoginService)
    {
        this.serviceURL = configSer.ServiceURL;
        ////this.screeningQuestions = [];
        this.screening = new ScreenedProcess({});
        this.recruiterSelectedJob = [];
    }
    
    ngOnInit() {
    }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
    }

    getLoginId() {
        return this.loggedUserId;
    }

    getCategories(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Visa/GetCategories')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getQuestions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Visa/GetQuestions')
                .subscribe((response: any) => {
                    if (response != null && response != undefined && response.ResultStatus >= 0)
                    {
                        this.questions = response.Output;

                        if (this.searchText && this.searchText !== '') {
                            this.questions = FuseUtils.filterArrayByString(this.questions, this.searchText);
                        }

                        if (this.questions.length > 0)
                        {
                            this.questions = this.questions.map(question => {
                                return new Question(question);
                            });
                        }

                        this.onQuestionChanged.next(this.questions);
                        resolve(this.questions);
                    }
                    else {
                        resolve(response);
                    }
                }, reject);
        });
    }

    getConsultants(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Visa/GetExternalConsultants')
                .subscribe((response: any) => {
                    if (response != null && response != undefined && response.ResultStatus >= 0)
                    {
                        this.consultants = response.Output;

                        if (this.searchText && this.searchText !== '') {
                            this.consultants = FuseUtils.filterArrayByString(this.consultants, this.searchText);
                        }

                        if (this.consultants.length > 0)
                        {
                            this.consultants = this.consultants.map(consultant => {
                                return new ExternalConsultant(consultant);
                            });
                        }

                        this.onConsultantChanged.next(this.consultants);
                        resolve(response);
                    }
                    else {
                        resolve(response);
                    }
                }, reject);
        });
    }

    getScreenQuestions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Visa/GetScreenQuestions')
                .subscribe((response: any) => {
                    if (response != null && response != undefined && response.ResultStatus >= 0) {
                        this.screenQuestions = response.Output;

                        if (this.searchText && this.searchText !== '') {
                            this.screenQuestions = FuseUtils.filterArrayByString(this.screenQuestions, this.searchText);
                        }

                        if (this.screenQuestions.length > 0) {
                            this.screenQuestions = this.screenQuestions.map(question => {
                                return new ScreenQuestion(question);
                            });
                        }

                        this.onScreenQuestionChanged.next(this.screenQuestions);
                        resolve(this.screenQuestions);
                    }
                    else {
                        resolve(response);
                    }
                }, reject);
        });
    }

    deleteQuestion(id: Number) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Visa/DeleteQuestion?questionId=' + id + '&loginId=' + this.loggedUserId, { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    saveQuestion(question: Question)
    {
        question.loginid = this.loggedUserId
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Visa/SaveQuestion', question, { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    saveScreenQuestion(question: ScreenQuestion) {
        question.loginid = this.loggedUserId;
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Visa/SaveScreenQuestion', question, { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    saveScreening(screening: ScreenedProcess)
    {
        screening.loginid = this.loggedUserId;
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Visa/SaveScreening', screening, { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }
}