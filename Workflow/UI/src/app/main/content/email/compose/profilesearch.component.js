"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var startWith_1 = require("rxjs/operators/startWith");
var map_1 = require("rxjs/operators/map");
var animations_1 = require("../../../../core/animations");
var app_model_1 = require("../../../../app.model");
var search_model_1 = require("../search.model");
var ProfileSearchComponent = /** @class */ (function () {
    function ProfileSearchComponent(confirmDialog, searchService, router, formBuilder, jobsService, loginService, snackComp, utilities) {
        this.confirmDialog = confirmDialog;
        this.searchService = searchService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.jobsService = jobsService;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.isFormExpanded = true;
        this.isSavable = false;
        this.jobList = [];
        this.overrideInput = false;
        this.jobsAC = new forms_1.FormControl();
        this.searchForm = new search_model_1.ProfileSearchCriteria({});
        this.profileResult = new search_model_1.ProfileSearchResult({});
        this.profileResultStatic = new search_model_1.ProfileSearchResult({});
        this.isPaging = false;
    }
    ProfileSearchComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.getJobList();
        //this.filteredjobList = this.jobsAC.valueChanges.pipe(
        //    startWith(''),
        //    map(job => job ? this.filterJobs(job) : this.jobList.slice())
        //);
        //this.searchInput.valueChanges
        //    .debounceTime(300)
        //    .subscribe(searchText => {
        //        this.paginator.pageIndex = 0;
        //        this.jobsService.onSearchClientTextChanged.next(searchText);
        //    });
    };
    ProfileSearchComponent.prototype.ngOnDestroy = function () {
    };
    ProfileSearchComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    };
    ProfileSearchComponent.prototype.selectedJob = function (event) {
        if (event.value != undefined) {
            var job = this.jobList.filter(function (x) {
                return x.jobid == event.value;
            });
            this.searchForm.jobid = 0;
            this.searchForm.title = job[0].title;
            this.searchForm.location = job[0].location;
            this.overrideInput = false;
        }
        else {
            this.searchForm.jobid = null;
            this.searchForm.title = '';
            this.searchForm.location = '';
        }
        this.validateForm();
    };
    ProfileSearchComponent.prototype.optionSelectedJob = function (event) {
        if (event.option != undefined && event.option.value != undefined) {
            var job = this.jobList.filter(function (x) {
                return x.jobid == event.option.value;
            });
            this.searchForm.jobid = 0;
            this.searchForm.title = job[0].title;
            this.searchForm.location = job[0].location;
            this.overrideInput = false;
            this.searchForm.formattedtitle = job[0].formattedtitle;
        }
        else {
            this.searchForm.jobid = null;
            this.searchForm.title = '';
            this.searchForm.location = '';
        }
        this.validateForm();
    };
    ProfileSearchComponent.prototype.override = function (event) {
        if (event.checked)
            this.overrideInput = true;
        else
            this.overrideInput = false;
    };
    ProfileSearchComponent.prototype.clearForm = function () {
        this.searchForm = new search_model_1.ProfileSearchCriteria({});
        this.isSavable = false;
    };
    ProfileSearchComponent.prototype.validateForm = function () {
        var form = this.searchForm;
        if (form.title.length > 0 || form.location.length > 0 || form.skill1.length > 0 || form.skill2.length > 0 || form.skill3.length > 0)
            this.isSavable = true;
        else
            this.isSavable = false;
    };
    ProfileSearchComponent.prototype.indexing = function () {
        debugger;
        var that = this;
        var token = that.loginService.googleUser.Zi.access_token;
        //let clientId = '753784829804-cfrlujr1mlbro56rpml19vqdpq9c18iv.apps.googleusercontent.com'; //indexing api
        var clientId = '753784829804-d881hvgn7je19fj8pp0goe09gja7o5cp.apps.googleusercontent.com'; //sign in
        that.searchService.indexing(token).then(function (response) {
            console.log('indexing call success');
        }).catch(function () {
            console.log('error occurred.');
        });
        //https://www.apps.techdigitalcorp.com/Workflow-Dev/gjobs/data2.html
        ////gapi.load('client', function() {
        ////    let init = gapi.client.init({
        ////        apiKey: 'AIzaSyCHT7SEp5bPMxvafWIYs_QcYgIelGgFDWo',
        ////        clientId: '753784829804-d881hvgn7je19fj8pp0goe09gja7o5cp.apps.googleusercontent.com',
        ////        scope: 'https://www.googleapis.com/auth/indexing'
        ////    }).then(function () {
        ////        console.log('success');
        ////        });
        ////    let auth = gapi.auth2.getAuthInstance().signIn();
        ////});
        //gapi.load('client', function () {
        //    gapi.client.init({
        //        apiKey: 'AIzaSyCXd3M-Cb0KvyBMKTNS23nfaoiez6l51Go',
        //        //discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/indexing/v1/rest"],
        //        clientId: clientId,
        //        scope: that.scope
        //        //scope: 'https://www.googleapis.com/auth/indexing'
        //    }).then(function () {
        //        //gapi.client.
        //        //alert('fds');
        //        console.log('auth completed');
        //        that.searchService.indexing(token).then(response => {
        //            console.log('indexing call success');
        //            });
        //        }).catch(function() {
        //        console.log('error occurred.');
        //        });
        //});
        //gapi.load('auth2', function () {
        //    /**
        //     * Retrieve the singleton for the GoogleAuth library and set up the
        //     * client.
        //     */
        //    //private clientId:string = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';  // localhost
        //    //private clientId:string = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com'; // live
        //    //let token: any;
        //    let token = that.loginService.googleUser.Zi.access_token;
        //    ////let clientId = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com'; //sign in
        //    let clientId = '753784829804-fadksliepvhl1l281cpvnfqp4u1a00gv.apps.googleusercontent.com'; //indexing api
        //    if (window.location.hostname != 'localhost')
        //        clientId = '753784829804-fadksliepvhl1l281cpvnfqp4u1a00gv.apps.googleusercontent.com'
        //    that.auth2 = gapi.auth.authorize({
        //        client_id: clientId,
        //        scope: that.scope,
        //        immediate: true,
        //        authuser: 0,
        //        response_type: 'token'
        //        //scope: 'https://www.googleapis.com/auth/indexing'
        //    }, token);
        //    //let au = gapi.auth2.getAuthInstance();
        //    console.log(that.auth2);
        //    console.log('IsSigned? = ' + that.auth2.isSignedIn);
        //    if(that.auth2.isSignedIn) {
        //        debugger;
        //        that.searchService.indexing(that.auth2.currentUser.Ab.Zi.access_token).then(response => {
        //        });
        //    };            
        //});        
        //this.searchService.indexing().then(response => {
        //});
    };
    ProfileSearchComponent.prototype.openWeb = function (site) {
        var _this = this;
        var baseURL = '', query = '', URL = '';
        var headline = ['Actively Seeking', 'Actively Looking', 'Open for Opportunities', 'Open for employment', 'Currently looking'];
        if (this.searchForm.title.length > 0)
            query += '"' + encodeURI(this.searchForm.title) + '" ';
        if (this.searchForm.skill1.length > 0)
            query += '"' + encodeURI(this.searchForm.skill1) + '" ';
        if (this.searchForm.skill2.length > 0)
            query += '"' + encodeURI(this.searchForm.skill2) + '" ';
        if (this.searchForm.skill3.length > 0)
            query += '"' + encodeURI(this.searchForm.skill3) + '" ';
        //if (site != 'linkedin' && this.searchForm.headline.length > 0)
        //{
        //    query += '"' + encodeURI(this.searchForm.headline) + '" ';
        //}
        if (site != 'linkedin' && this.searchForm.isjobseeker) {
            for (var i = 0; i < headline.length; i++) {
                if (i == 0)
                    query += '(';
                if (i > 0 && i <= headline.length - 1)
                    query += ' OR ';
                query += '"' + encodeURI(headline[i]) + '" ';
                if (i == headline.length - 1)
                    query += ')';
            }
            if (headline.length > 0)
                this.searchForm.headline = headline.toString();
        }
        if (this.searchForm.location.length > 0)
            query += ' "' + encodeURI(this.searchForm.location) + '" ';
        if (query.indexOf('#') >= 0) {
            query = query.replace('#', '%23');
        }
        if (site == 'google') {
            baseURL = 'https://www.google.com/search?q=';
            URL = baseURL + query + ' -intitle:"profiles" -inurl:"dir/+"+site:www.linkedin.com/in/';
        }
        else if (site == 'bing') {
            baseURL = 'https://www.bing.com/search?q=';
            URL = baseURL + query + ' site:www.linkedin.com/in/';
        }
        else if (site == 'linkedin') {
            //https://www.linkedin.com/search/results/all/?keywords=headline%3ALooking%20for%20opportunity%20%22%20Technical%20Writer%22%20%22Minneapolis%22&origin=GLOBAL_SEARCH_HEADER
            var headline_1 = '';
            if (this.searchForm.headline.length > 0)
                headline_1 = 'headline:' + encodeURI(this.searchForm.headline) + ' ';
            baseURL = 'https://www.linkedin.com/search/results/all/?keywords=';
            URL = baseURL + headline_1 + query + '&origin=GLOBAL_SEARCH_HEADER';
        }
        this.searchForm.isoverride = this.overrideInput;
        this.searchForm.searchengine = site;
        this.searchForm.searchstring = URL;
        this.searchService.saveProfileSearch(this.searchForm)
            .then(function (response) {
            _this.snackComp.showSnackBarPost(response, '');
        });
        if (URL.length > 0)
            window.open(URL, '_blank');
        //let URL = 'https://www.google.com/search?q=+%22.net+developer%22%20-intitle:%22profiles%22%20-inurl:%22dir/+%22+site:www.linkedin.com/in/+OR+site:www.linkedin.com/pub/';
        //let URL = baseURL + query + ' -intitle:"profiles" -inurl:"dir/+"+site:www.linkedin.com/in/';        
    };
    ProfileSearchComponent.prototype.loadPage = function (page) {
        if (page == 'job')
            this.router.navigateByUrl('/jobs');
    };
    ProfileSearchComponent.prototype.getJobList = function () {
        var _this = this;
        this.jobList = [];
        this.jobsService.getJobListForDD().then(function (response) {
            if (response) {
                response.map(function (job) {
                    _this.jobList.push({ "jobid": job["rowid"], "title": job["title"], "location": job["location"], "formattedtitle": job["formattedtitle"] });
                });
                _this.filteredjobList = _this.jobsAC.valueChanges.pipe(startWith_1.startWith(''), map_1.map(function (job) { return job ? _this.filterJobs(job) : _this.jobList.slice(); }));
            }
        });
    };
    ProfileSearchComponent.prototype.filterJobs = function (content) {
        return this.jobList.filter(function (job) {
            return job.title.toLowerCase().indexOf(content.toString().toLowerCase()) === 0;
        });
    };
    /* Not Used */
    ProfileSearchComponent.prototype.searchWebProfile = function (site) {
        this.isPaging = false;
        this.pageIndex = 0;
        this.searchProfile(site);
    };
    ProfileSearchComponent.prototype.pageChange = function (event) {
        this.isPaging = true;
        this.pageIndex = event.pageIndex;
        this.searchProfile('');
    };
    ProfileSearchComponent.prototype.searchProfile = function (site) {
        var _this = this;
        this.profileResult = new search_model_1.ProfileSearchResult({});
        var startIndex = 1;
        var query = '&q=';
        var sites = [];
        var cse = false;
        {
            if (this.pageIndex > 0)
                startIndex = this.pageIndex * 10 + 1;
            else {
                this.pageIndex = 0;
                startIndex = 1;
                if (this.pageIndex == 0 && !this.isPaging) {
                    this.profileResultStatic = new search_model_1.ProfileSearchResult({});
                    this.resultCount = [];
                }
            }
            if (this.resultCount.length > this.pageIndex || this.pageIndex < this.resultCount.length) {
                var startItem = 0, endItem = 9;
                for (var i = 0; i < this.pageIndex; i++)
                    startItem += this.resultCount[i];
                endItem = startItem + this.resultCount[this.pageIndex] - 1;
                for (var j = startItem; j <= endItem; j++)
                    this.profileResult.profiles.push(this.profileResultStatic.profiles[j]);
                this.profileResult.resultCount = this.profileResultStatic.resultCount;
                this.searchService.onSearchProfileChanged.next(this.profileResult);
            }
            else if (this.pageIndex == 0 && this.isPaging) {
                var endItem = this.resultCount[0] - 1;
                for (var j = 0; j <= endItem; j++)
                    this.profileResult.profiles.push(this.profileResultStatic.profiles[j]);
                this.profileResult.resultCount = this.profileResultStatic.resultCount;
                this.searchService.onSearchProfileChanged.next(this.profileResult);
            }
            else {
                var searchQuery = '', googleSiteRestricted = true;
                //let baseURL = 'https://www.googleapis.com/customsearch/v1/siterestrict?site=webhp&start=' + startIndex + '&cx=' + this.utilities.googleCX + '&key=' + this.utilities.googleCSEApiKey;
                var baseURL = 'https://www.googleapis.com/customsearch/v1/siterestrict?start=' + startIndex + '&cx=' + this.utilities.googleCX + '&key=' + this.utilities.googleCSEApiKey;
                this.profileResult = new search_model_1.ProfileSearchResult({});
                sites.push('site:linkedin.com/in+OR+site:linkedin.com/pub/');
                if (!googleSiteRestricted) {
                    sites.push('site:github.com');
                    ////sites.push('site:linkedin.com/in');
                    ////sites.push('site:linkedin.com/pub/');
                }
                //let searchQuery = 'http://www.google.com/search?q=+"c%23" AND "sql+server" -intitle:"profiles" -inurl:"dir/+"+site:www.linkedin.com/in/+OR+site:www.linkedin.com/pub/';
                //let searchQuery = 'https://www.bing.com/search?q=(%22.net%20developer%22)%20site:linkedin.com/in';
                //'https://www.googleapis.com/customsearch/v1?site=webhp&q=(%22.net%20developer%22)%20(%22Minneapolis%22)%20(%22Looking%20for%20opportunity%22)%20site:linkedin.com/in&num=10&start=' + startIndex + '&cx=' + cx + '&key=' + googleApiSearchKey;
                if (this.searchForm.skill1.length > 0)
                    query += '("' + encodeURI(this.searchForm.skill1) + '")%20';
                if (this.searchForm.skill2.length > 0)
                    query += '("' + encodeURI(this.searchForm.skill2) + '")%20';
                if (this.searchForm.skill3.length > 0)
                    query += '("' + encodeURI(this.searchForm.skill3) + '")%20';
                if (this.searchForm.headline.length > 0)
                    query += '("' + encodeURI(this.searchForm.headline) + '")%20';
                if (this.searchForm.location.length > 0)
                    query += '("' + encodeURI(this.searchForm.location) + '")%20';
                searchQuery = baseURL + query;
                for (var i = 0; i < sites.length; i++) {
                    if (!googleSiteRestricted) {
                        if (i > 0)
                            searchQuery = searchQuery.replace(sites[i - 1], sites[i]);
                        else
                            searchQuery = searchQuery + sites[i];
                    }
                    //console.log(searchQuery);
                    console.log(query);
                    this.progressbar.showProgress();
                    this.searchService.searchProfile(searchQuery).then(function (response) {
                        if (response.profiles) {
                            //this.clearForm();
                            _this.progressbar.hideProgress();
                            if (_this.profileResult.resultCount > 0) {
                                _this.profileResult.resultCount += response.resultCount;
                                _this.profileResultStatic.resultCount += response.resultCount;
                                //this.resultCount[this.pageIndex] += response.profiles.length;
                            }
                            else {
                                _this.profileResult.resultCount = response.resultCount;
                                _this.profileResultStatic.resultCount = response.resultCount;
                            }
                            if (_this.resultCount.length == _this.pageIndex)
                                _this.resultCount.push(response.profiles.length);
                            else if (_this.resultCount.length > _this.pageIndex)
                                _this.resultCount[_this.pageIndex] += response.profiles.length;
                            response.profiles.map(function (profile) {
                                _this.profileResult.profiles.push(profile);
                                _this.profileResultStatic.profiles.push(profile);
                            });
                            if (_this.profileResult.profiles.length > 0)
                                _this.isFormExpanded = false;
                            //this.snackComp.showUnfinishedSnackBar(response["Message"]);
                        }
                    });
                }
            }
        }
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ProfileSearchComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], ProfileSearchComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], ProfileSearchComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], ProfileSearchComponent.prototype, "sort", void 0);
    ProfileSearchComponent = __decorate([
        core_1.Component({
            selector: 'profilesearch',
            templateUrl: './profilesearch.component.html',
            //styleUrls: ['./jobs-client.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ProfileSearchComponent);
    return ProfileSearchComponent;
}());
exports.ProfileSearchComponent = ProfileSearchComponent;
