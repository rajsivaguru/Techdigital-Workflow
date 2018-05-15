"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var jobs_model_1 = require("./jobs.model");
var fuseUtils_1 = require("../../../core/fuseUtils");
var Subject_1 = require("rxjs/Subject");
var JobsService = /** @class */ (function () {
    function JobsService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onContactsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedContactsChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.newJobsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedNewJobsChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onSearchNewJobsTextChanged = new Subject_1.Subject();
        this.onFilterChanged = new Subject_1.Subject();
        this.selectedContacts = [];
        this.selectedNewJobs = [];
        this.searchJob = function (keyword) {
            try {
                // if (keyword) {
                // return this.http.get(this.serviceURL+'SearchJob?keyword=' + keyword)
                //     .map(res => {
                //     let json = res.json();
                //     return JSON.parse(json);
                //     })
                // } else 
                // {
                //     return Observable.of([]);
                // }
            }
            catch (ex) {
                //console.log(ex)
                return Observable_1.Observable.of([]);
            }
        };
        this.serviceURL = configSer.ServiceURL;
    }
    JobsService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    JobsService.prototype.resolve = function (route, state) {
        var _this = this;
        this.searchText = "";
        if (state.url == "/jobs") {
            return new Promise(function (resolve, reject) {
                //console.log(state)
                Promise.all([
                    _this.getJobs()
                    //this.getPriority()
                ]).then(function (_a) {
                    var files = _a[0];
                    _this.onSearchTextChanged.subscribe(function (searchText) {
                        _this.searchText = searchText;
                        _this.getJobs();
                    });
                    _this.onFilterChanged.subscribe(function (filter) {
                        _this.filterBy = filter;
                        _this.getJobs();
                    });
                    resolve();
                }, reject);
            });
        }
        else if (state.url == "/jobsload") {
            return new Promise(function (resolve, reject) {
                //console.log(state)
                Promise.all([
                    _this.getNewJobs()
                ]).then(function (_a) {
                    var files = _a[0];
                    _this.onSearchNewJobsTextChanged.subscribe(function (searchText) {
                        _this.searchText = searchText;
                        _this.getNewJobs();
                    });
                    _this.onFilterChanged.subscribe(function (filter) {
                        _this.filterBy = filter;
                        _this.getNewJobs();
                    });
                    resolve();
                }, reject);
            });
        }
    };
    JobsService.prototype.getNewJobs = function () {
        var _this = this;
        //if(this.action != 'edit')
        {
            var userid_1 = '0';
            if (this.loginService.loggedUser != undefined)
                userid_1 = this.loginService.loggedUser.userid;
            return new Promise(function (resolve, reject) {
                _this.http.get(_this.serviceURL + 'TDW/GetJobList?loginid=' + userid_1)
                    .subscribe(function (response) {
                    if (response != null && response != undefined) {
                        response = JSON.parse(response);
                        //console.log('joblist fetching..');
                        //console.log(response)
                        _this.newJobs = response;
                        //console.log(this.newJobs)
                        // if ( this.filterBy === 'starred' )
                        // {
                        //     this.newJobs = this.newJobs.filter(_contact => {
                        //         return this.user.starred.includes(_contact.jobid);
                        //     });
                        // }
                        // if ( this.filterBy === 'frequent' )
                        // {
                        //     this.newJobs = this.newJobs.filter(_contact => {
                        //         return this.user.frequentjobs.includes(_contact.jobid);
                        //     });
                        // }
                        //console.log(this.searchText)
                        if (_this.searchText && _this.searchText !== '') {
                            _this.newJobs = fuseUtils_1.FuseUtils.filterArrayByString(_this.newJobs, _this.searchText);
                            //console.log(this.newJobs)
                        }
                        if (_this.newJobs.length > 0) {
                            _this.newJobs = _this.newJobs.map(function (contact) {
                                return new jobs_model_1.JobsList(contact);
                            });
                        }
                        _this.newJobsChanged.next(_this.newJobs);
                        resolve(_this.newJobs);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
            });
        }
    };
    JobsService.prototype.getJobs = function () {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindJobs?loginid=' + userid)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    response = JSON.parse(response);
                    //console.log('fetching jobs...');
                    //console.log(response)
                    _this.jobs = response;
                    if (_this.filterBy === 'starred') {
                        _this.jobs = _this.jobs.filter(function (_contact) {
                            return _this.user.starred.includes(_contact.jobassignmentid);
                        });
                    }
                    if (_this.filterBy === 'frequent') {
                        _this.jobs = _this.jobs.filter(function (_contact) {
                            return _this.user.frequentjobs.includes(_contact.jobassignmentid);
                        });
                    }
                    if (_this.searchText && _this.searchText !== '') {
                        _this.jobs = fuseUtils_1.FuseUtils.filterArrayByString(_this.jobs, _this.searchText);
                    }
                    if (_this.jobs.length > 0) {
                        _this.jobs = _this.jobs.map(function (contact) {
                            return new jobs_model_1.Jobs(contact);
                        });
                    }
                    _this.onContactsChanged.next(_this.jobs);
                    resolve(_this.jobs);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    JobsService.prototype.getPriority = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindPriority')
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    JobsService.prototype.getClients = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Job/GetClients')
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    JobsService.prototype.searchUser = function (keyword) {
        //console.log('call service'+keyword+this.serviceURL+'SearchUser?keyword=' + keyword);
        this.http.get(this.serviceURL + 'TDW/SearchUser?keyword=' + keyword)
            .subscribe(function (response) {
            //response = JSON.parse(response);
            //console.log('service');
            //console.log(JSON.parse(response));
            return (JSON.parse(response));
        });
    };
    JobsService.prototype.toggleSelectedNewJob = function (id) {
        // First, check if we already have that todo as selected...
        if (this.selectedNewJobs.length > 0) {
            var index = this.selectedNewJobs.indexOf(id);
            if (index !== -1) {
                this.selectedNewJobs.splice(index, 1);
                // Trigger the next event
                this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
                // Return
                return;
            }
        }
        // If we don't have it, push as selected
        this.selectedNewJobs.push(id);
        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
    };
    /**
     * Toggle selected contact by id
     * @param id
     */
    JobsService.prototype.toggleSelectedContact = function (id) {
        // First, check if we already have that todo as selected...
        if (this.selectedContacts.length > 0) {
            var index = this.selectedContacts.indexOf(id);
            if (index !== -1) {
                this.selectedContacts.splice(index, 1);
                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);
                // Return
                return;
            }
        }
        // If we don't have it, push as selected
        this.selectedContacts.push(id);
        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    };
    JobsService.prototype.toggleSelectAllNewJob = function () {
        if (this.selectedNewJobs.length > 0) {
            this.deselectNewJobs();
        }
        else {
            this.selectNewJobs();
        }
    };
    /**
     * Toggle select all
     */
    JobsService.prototype.toggleSelectAll = function () {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        }
        else {
            this.selectContacts();
        }
    };
    JobsService.prototype.selectNewJobs = function (filterParameter, filterValue) {
        var _this = this;
        this.selectedNewJobs = [];
        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedNewJobs = [];
            this.newJobs.map(function (contact) {
                _this.selectedNewJobs.push(contact.jobid);
            });
        }
        else {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }
        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedContacts);
    };
    JobsService.prototype.selectContacts = function (filterParameter, filterValue) {
        var _this = this;
        this.selectedContacts = [];
        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.jobs.map(function (contact) {
                _this.selectedContacts.push(contact.jobassignmentid);
            });
        }
        else {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }
        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    };
    JobsService.prototype.updateJob = function (job) {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/SaveJob?sJobModel=' + JSON.stringify(job) + '&loginid=' + userid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.getJobs();
                resolve(response);
            });
        });
    };
    JobsService.prototype.synchJobs = function () {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/SynchJobs')
                .subscribe(function (response) {
                response = JSON.parse(response);
                //this.getJobs();
                resolve(response);
            });
        });
    };
    JobsService.prototype.saveJobUser = function (jobAssign) {
        var _this = this;
        jobAssign.loginid = '0';
        if (this.loginService.loggedUser != undefined)
            jobAssign.loginid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            //this.http.get(this.serviceURL+'TDW/SaveJobUser?userid=' + users +'&jobid='+ jobid +'&priorityid='+ priorityid +'&clientname='+ clientname  + '&loginid='+ userid)
            //this.http.get(this.serviceURL+'TDW/SaveJobUser?objJobAssignParam=' + JSON.stringify(jobAssign))
            _this.http.get(_this.serviceURL + 'Job/AssignJobUser?source=' + JSON.stringify(jobAssign))
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.getNewJobs();
                resolve(response);
            });
        });
    };
    JobsService.prototype.getJobStatus = function (jobassignmentid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindJobStatus?jobassignmentid=' + jobassignmentid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                // console.log(response);
                _this.jobStatus = response;
                resolve(_this.jobStatus);
            }, reject);
        });
    };
    JobsService.prototype.getJobStatusHistory = function (jobassignmentid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindJobStatusHistory?jobassignmentid=' + jobassignmentid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.jobHistory = response;
                //console.log(this.jobHistory);
                resolve(_this.jobHistory);
            }, reject);
        });
    };
    JobsService.prototype.updateJobStatus = function (jaid, statusid, comment) {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/UpdateJobStatus?jobassignmentid=' + jaid + '&statusid=' + statusid + '&comment=' + comment + '&userid=' + userid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                //this.getJobs();
                resolve(response);
            });
        });
    };
    JobsService.prototype.updateUserData = function (userData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post('api/contacts-user/' + _this.user.id, __assign({}, userData))
                .subscribe(function (response) {
                //this.getPriority();
                _this.getJobs();
                resolve(response);
            });
        });
    };
    JobsService.prototype.deselectNewJobs = function () {
        this.selectedNewJobs = [];
        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
    };
    JobsService.prototype.deselectContacts = function () {
        this.selectedContacts = [];
        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    };
    JobsService.prototype.deleteContact = function (contact) {
        var contactIndex = this.jobs.indexOf(contact);
        this.jobs.splice(contactIndex, 1);
        this.onContactsChanged.next(this.jobs);
    };
    JobsService.prototype.deleteSelectedNewJobs = function () {
        var _loop_1 = function (contactId) {
            var contact = this_1.newJobs.find(function (_contact) {
                return _contact.jobid === contactId;
            });
            var contactIndex = this_1.newJobs.indexOf(contact);
            this_1.newJobs.splice(contactIndex, 1);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.selectedNewJobs; _i < _a.length; _i++) {
            var contactId = _a[_i];
            _loop_1(contactId);
        }
        this.newJobsChanged.next(this.jobs);
        this.deselectNewJobs();
    };
    JobsService.prototype.deleteSelectedContacts = function () {
        var _loop_2 = function (contactId) {
            var contact = this_2.jobs.find(function (_contact) {
                return _contact.jobassignmentid === contactId;
            });
            var contactIndex = this_2.jobs.indexOf(contact);
            this_2.jobs.splice(contactIndex, 1);
        };
        var this_2 = this;
        for (var _i = 0, _a = this.selectedContacts; _i < _a.length; _i++) {
            var contactId = _a[_i];
            _loop_2(contactId);
        }
        this.onContactsChanged.next(this.jobs);
        this.deselectContacts();
    };
    JobsService = __decorate([
        core_1.Injectable()
    ], JobsService);
    return JobsService;
}());
exports.JobsService = JobsService;
