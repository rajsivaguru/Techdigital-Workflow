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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var fuseUtils_1 = require("../../../core/fuseUtils");
var jobs_model_1 = require("./jobs.model");
var headers = new http_1.HttpHeaders();
headers.set("Content-Type", "application/json");
var JobsService = /** @class */ (function () {
    function JobsService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onContactsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedContactsChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.newJobsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedNewJobsChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onClientChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedClientChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onSearchNewJobsTextChanged = new Subject_1.Subject();
        this.onSearchClientTextChanged = new Subject_1.Subject();
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
        this.loggedUserId = this.loginService.getLoginId();
        this.headerOptions = this.loginService.getHeaders();
        if (state.url == "/jobs") {
            return new Promise(function (resolve, reject) {
                Promise.all([
                    //this.getPriority(),
                    _this.getNewJobs(false)
                ]).then(function (_a) {
                    var files = _a[0];
                    _this.onSearchNewJobsTextChanged.subscribe(function (searchText) {
                        _this.searchText = searchText;
                        _this.getNewJobs(false);
                    });
                    _this.onFilterChanged.subscribe(function (filter) {
                        _this.filterBy = filter;
                        _this.getNewJobs(false);
                    });
                    resolve();
                }, reject);
            });
        }
        else if (state.url == "/clients") {
            return new Promise(function (resolve, reject) {
                Promise.all([
                    _this.getClients()
                ]).then(function (_a) {
                    var files = _a[0];
                    _this.onSearchClientTextChanged.subscribe(function (searchText) {
                        _this.searchText = searchText;
                        _this.getClients();
                    });
                    _this.onFilterChanged.subscribe(function (filter) {
                        _this.filterBy = filter;
                        _this.getClients();
                    });
                    resolve();
                }, reject);
            });
        }
    };
    JobsService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    /* Jobs */
    JobsService.prototype.getNewJobs = function (isRefresh) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.storageJobs != undefined && _this.storageJobs.length > 0 && !isRefresh) {
                if (_this.searchText && _this.searchText !== '') {
                    _this.newJobs = fuseUtils_1.FuseUtils.filterArrayByString(_this.storageJobs, _this.searchText);
                    if (_this.newJobs.length > 0) {
                        _this.newJobs = _this.newJobs.map(function (contact) {
                            return new jobs_model_1.JobsList(contact);
                        });
                    }
                }
                else
                    _this.newJobs = _this.storageJobs.map(function (job) {
                        return new jobs_model_1.JobsList(job);
                    });
                _this.newJobsChanged.next(_this.newJobs);
                resolve(_this.newJobs);
            }
            else
                _this.http.get(_this.serviceURL + 'Job/GetJobList?loginid=' + _this.loggedUserId)
                    .subscribe(function (response) {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            _this.newJobs = response["Output"];
                            _this.storageJobs = response["Output"];
                            if (_this.searchText && _this.searchText !== '') {
                                _this.newJobs = fuseUtils_1.FuseUtils.filterArrayByString(_this.newJobs, _this.searchText);
                            }
                            if (_this.newJobs.length > 0) {
                                _this.newJobs = _this.newJobs.map(function (contact) {
                                    return new jobs_model_1.JobsList(contact);
                                });
                            }
                            _this.newJobsChanged.next(_this.newJobs);
                            resolve(_this.newJobs);
                        }
                        else
                            resolve([]);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        });
    };
    JobsService.prototype.getJobListForDD = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Job/GetJobListForDD?loginid=' + _this.loggedUserId)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    if (response["ResultStatus"] == "1") {
                        resolve(response["Output"]);
                    }
                    else
                        resolve([]);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    JobsService.prototype.synchJobs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Job/SynchJobsXML')
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            });
        });
    };
    /* Save single job. */
    JobsService.prototype.saveJobAssignment = function (jobAssignment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Job/SaveJobAssignment', jobAssignment, { headers: headers })
                .subscribe(function (response) {
                _this.getNewJobs(true).then(function (result) {
                    resolve(response);
                });
            });
        });
    };
    /* Save multiple jobs. */
    JobsService.prototype.saveJobsAssignment = function (jobAssignments) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ////this.http.get(this.serviceURL + 'Job/SaveJobAssignments?source=' + JSON.stringify(jobAssignments) + '&loginId=' + this.loginService.loggedUser.userid)
            _this.http.post(_this.serviceURL + 'Job/SaveJobsAssignment', jobAssignments, { headers: headers })
                .subscribe(function (response) {
                _this.getNewJobs(true).then(function (result) {
                    resolve(response);
                });
            });
        });
    };
    /* Notify My Interest on Job */
    JobsService.prototype.saveInterestedJob = function (job) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Job/SaveInterestedJob', job, _this.headerOptions)
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    JobsService.prototype.getClients = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Client/GetClients', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    //response = JSON.parse(response);
                    _this.clients = response.Output;
                    if (_this.searchText && _this.searchText !== '') {
                        _this.clients = fuseUtils_1.FuseUtils.filterArrayByString(_this.clients, _this.searchText);
                    }
                    _this.onClientChanged.next(_this.clients);
                    resolve(_this.clients);
                }
                else {
                    resolve([]);
                }
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    JobsService.prototype.saveClient = function (client) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Client/SaveClient', client, _this.headerOptions)
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.getClients();
                resolve(response);
            });
        });
    };
    JobsService.prototype.deleteJobClient = function (client) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Client/DeleteClient?clientId=' + client.id, _this.headerOptions)
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.getClients();
                resolve(response);
            });
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
    JobsService.prototype.getPrioritizedJobList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Job/GetPriorityJobs', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    if (response["ResultStatus"] == "1") {
                        _this.prioritizedJobs = response["Output"];
                        if (_this.prioritizedJobs.length > 0) {
                            _this.prioritizedJobs = _this.prioritizedJobs.map(function (job) {
                                return new jobs_model_1.PriorityJob(job);
                            });
                        }
                        else
                            resolve([]);
                    }
                    else
                        resolve([]);
                    resolve(_this.prioritizedJobs);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    JobsService.prototype.savePriority = function (jobIds) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Job/SavePriorityJob?jobIds=' + jobIds, _this.headerOptions)
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    /* Not Used;  Need to check with service. */
    /*
    getJobs(): Promise<any> {
        let userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/BindJobs?loginid=' + userid)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        response = JSON.parse(response);

                        this.jobs = response;

                        if (this.filterBy === 'starred') {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.starred.includes(_contact.jobassignmentid);
                            });
                        }

                        if (this.filterBy === 'frequent') {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.frequentjobs.includes(_contact.jobassignmentid);
                            });
                        }

                        if (this.searchText && this.searchText !== '') {
                            this.jobs = FuseUtils.filterArrayByString(this.jobs, this.searchText);
                        }

                        if (this.jobs.length > 0) {
                            this.jobs = this.jobs.map(contact => {
                                return new Jobs(contact);
                            });
                        }

                        this.onContactsChanged.next(this.jobs);
                        resolve(this.jobs);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        }
        );
    }

    updateJob(job) {
        let userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/SaveJob?sJobModel=' + JSON.stringify(job) + '&loginid=' + userid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    this.getJobs();
                    resolve(response);
                });
        });
    }
    
    updateUserData(userData) {
        return new Promise((resolve, reject) => {
            this.http.post('api/contacts-user/' + this.user.id, { ...userData })
                .subscribe(response => {
                    //this.getPriority();
                    this.getJobs();
                    resolve(response);
                });
        });
    }
    */
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
    JobsService.prototype.getJobStatus = function (jobassignmentid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindJobStatus?jobassignmentid=' + jobassignmentid)
                .subscribe(function (response) {
                response = JSON.parse(response);
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
                resolve(_this.jobHistory);
            }, reject);
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
                _this.getNewJobs(true);
                resolve(response);
            });
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
    JobsService = __decorate([
        core_1.Injectable()
    ], JobsService);
    return JobsService;
}());
exports.JobsService = JobsService;
