import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '../../../../core/animations';
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ProgressBarConfig } from '../../../../app.model';
import { LoginService } from '../../login/login.service';
import { JobsService } from '../../jobs/jobs.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ProfileSearchCriteria, ProfileSearchResult, Profile } from '../search.model';
import { SearchService } from '../search.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'profilesearch',
    templateUrl: './profilesearch.component.html',
    //styleUrls: ['./jobs-client.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ProfileSearchComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    profileResult: ProfileSearchResult;
    profileResultStatic: ProfileSearchResult;
    progressbar: ProgressBarConfig;
    jobsAC: FormControl;
    isFormExpanded: boolean = true;
    isSavable: boolean = false;
    searchForm: ProfileSearchCriteria;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    matTableInner: number;

    jobList = []; 
    filteredjobList: Observable<any[]>;
    overrideInput: boolean = false;
    
    resultCount: number[];
    pageIndex: number;
    isPaging: boolean;

    ////private scope = ['profile', 'email', 'https://www.googleapis.com/auth/indexing'].join(' ');
    ////public auth2: any;

    constructor(
        private confirmDialog: MatDialog,
        private searchService: SearchService,
        public router: Router,
        private formBuilder: FormBuilder,
        private jobsService: JobsService,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.jobsAC = new FormControl();
        this.searchForm = new ProfileSearchCriteria({});
        this.profileResult = new ProfileSearchResult({});
        this.profileResultStatic = new ProfileSearchResult({});
        this.isPaging = false;        
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new ProgressBarConfig({});
        
        this.getJobList();        
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    }

    selectedJob(event)
    {
        if (event.value != undefined)
        {
            let job = this.jobList.filter((x) => {
                return x.jobid == event.value;
            });

            this.searchForm.jobid = 0;
            this.searchForm.title = job[0].title;
            this.searchForm.location = job[0].location;
            this.overrideInput = false;
        }
        else
        {
            this.searchForm.jobid = null;
            this.searchForm.title = '';
            this.searchForm.location = '';
        }

        this.validateForm();
    }

    optionSelectedJob(event) {
        if (event.option != undefined && event.option.value != undefined) {
            let job = this.jobList.filter((x) => {
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
    }

    override(event)
    {
        if (event.checked)
            this.overrideInput = true;
        else
            this.overrideInput = false;
    }

    clearForm() {
        this.searchForm = new ProfileSearchCriteria({});
        this.isSavable = false;
    }
    
    validateForm() {
        var form = this.searchForm;

        if (form.title.length > 0 || form.location.length > 0 || form.skill1.length > 0 || form.skill2.length > 0 || form.skill3.length > 0)
            this.isSavable = true;
        else
            this.isSavable = false;
    }

    indexing()
    {
        debugger;

        let that = this;
        let token = that.loginService.googleUser.Zi.access_token;
        //let clientId = '753784829804-cfrlujr1mlbro56rpml19vqdpq9c18iv.apps.googleusercontent.com'; //indexing api
        let clientId = '753784829804-d881hvgn7je19fj8pp0goe09gja7o5cp.apps.googleusercontent.com'; //sign in

        that.searchService.indexing(token).then(response => {
            console.log('indexing call success');
        }).catch(function() {
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
    }

    openWeb(site) {
        let baseURL = '', query = '', URL = '';
        let headline = ['Actively Seeking', 'Actively Looking', 'Open for Opportunities', 'Open for employment', 'Currently looking'];
        
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
            for (let i = 0; i < headline.length; i++)
            {
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

        if (query.indexOf('#') >= 0)
        {
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
        else if (site == 'linkedin') 
        {
            //https://www.linkedin.com/search/results/all/?keywords=headline%3ALooking%20for%20opportunity%20%22%20Technical%20Writer%22%20%22Minneapolis%22&origin=GLOBAL_SEARCH_HEADER

            let headline = '';
            if (this.searchForm.headline.length > 0)
                headline = 'headline:' + encodeURI(this.searchForm.headline) + ' ';

            baseURL = 'https://www.linkedin.com/search/results/all/?keywords=';
            URL = baseURL + headline + query + '&origin=GLOBAL_SEARCH_HEADER'
        }
        
        this.searchForm.isoverride = this.overrideInput;
        this.searchForm.searchengine = site;
        this.searchForm.searchstring = URL;

        this.searchService.saveProfileSearch(this.searchForm)
            .then(response => {
                this.snackComp.showSnackBarPost(response, '');
            });

        if (URL.length > 0)
            window.open(URL, '_blank');

        //let URL = 'https://www.google.com/search?q=+%22.net+developer%22%20-intitle:%22profiles%22%20-inurl:%22dir/+%22+site:www.linkedin.com/in/+OR+site:www.linkedin.com/pub/';
        //let URL = baseURL + query + ' -intitle:"profiles" -inurl:"dir/+"+site:www.linkedin.com/in/';        
    }

    loadPage(page) {
        if(page == 'job')
            this.router.navigateByUrl('/jobs');
    }


    private getJobList() {
        this.jobList = [];
        this.jobsService.getJobListForDD().then(response => {
            if (response) {
                response.map(job => {
                    this.jobList.push({ "jobid": job["rowid"], "title": job["title"], "location": job["location"], "formattedtitle": job["formattedtitle"] })
                });   

                this.filteredjobList = this.jobsAC.valueChanges.pipe(startWith(''),
                    map(job => job ? this.filterJobs(job) : this.jobList.slice())); 
            }
        });
    }

    filterJobs(content: string) {
        return this.jobList.filter(job =>
            job.title.toLowerCase().indexOf(content.toString().toLowerCase()) === 0);
    }

    /* Not Used */

    searchWebProfile(site) {
        this.isPaging = false;
        this.pageIndex = 0;
        this.searchProfile(site);
    }

    pageChange(event) {
        this.isPaging = true;
        this.pageIndex = event.pageIndex;
        this.searchProfile('');
    }

    private searchProfile(site) {
        this.profileResult = new ProfileSearchResult({});
        let startIndex = 1;
        let query = '&q=';
        let sites = [];
        let cse = false;

        {
            if (this.pageIndex > 0)
                startIndex = this.pageIndex * 10 + 1;
            else {
                this.pageIndex = 0;
                startIndex = 1;

                if (this.pageIndex == 0 && !this.isPaging) {
                    this.profileResultStatic = new ProfileSearchResult({});
                    this.resultCount = [];
                }
            }

            if (this.resultCount.length > this.pageIndex || this.pageIndex < this.resultCount.length) {
                let startItem = 0, endItem = 9;

                for (let i = 0; i < this.pageIndex; i++)
                    startItem += this.resultCount[i];

                endItem = startItem + this.resultCount[this.pageIndex] - 1;

                for (let j = startItem; j <= endItem; j++)
                    this.profileResult.profiles.push(this.profileResultStatic.profiles[j]);

                this.profileResult.resultCount = this.profileResultStatic.resultCount;
                this.searchService.onSearchProfileChanged.next(this.profileResult);
            }
            else if (this.pageIndex == 0 && this.isPaging) {
                let endItem = this.resultCount[0] - 1;

                for (let j = 0; j <= endItem; j++)
                    this.profileResult.profiles.push(this.profileResultStatic.profiles[j]);

                this.profileResult.resultCount = this.profileResultStatic.resultCount;
                this.searchService.onSearchProfileChanged.next(this.profileResult);
            }
            else {
                let searchQuery = '', googleSiteRestricted = true;
                //let baseURL = 'https://www.googleapis.com/customsearch/v1/siterestrict?site=webhp&start=' + startIndex + '&cx=' + this.utilities.googleCX + '&key=' + this.utilities.googleCSEApiKey;
                let baseURL = 'https://www.googleapis.com/customsearch/v1/siterestrict?start=' + startIndex + '&cx=' + this.utilities.googleCX + '&key=' + this.utilities.googleCSEApiKey;
                this.profileResult = new ProfileSearchResult({});

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

                for (let i = 0; i < sites.length; i++) {
                    if (!googleSiteRestricted) {
                        if (i > 0)
                            searchQuery = searchQuery.replace(sites[i - 1], sites[i]);
                        else
                            searchQuery = searchQuery + sites[i];
                    }

                    //console.log(searchQuery);
                    console.log(query);
                    this.progressbar.showProgress();

                    this.searchService.searchProfile(searchQuery).then(response => {
                        if (response.profiles) {
                            //this.clearForm();
                            this.progressbar.hideProgress();

                            if (this.profileResult.resultCount > 0) {
                                this.profileResult.resultCount += response.resultCount;
                                this.profileResultStatic.resultCount += response.resultCount;
                                //this.resultCount[this.pageIndex] += response.profiles.length;
                            }
                            else {
                                this.profileResult.resultCount = response.resultCount;
                                this.profileResultStatic.resultCount = response.resultCount;
                            }

                            if (this.resultCount.length == this.pageIndex)
                                this.resultCount.push(response.profiles.length);
                            else if (this.resultCount.length > this.pageIndex)
                                this.resultCount[this.pageIndex] += response.profiles.length;

                            response.profiles.map(profile => {
                                this.profileResult.profiles.push(profile);
                                this.profileResultStatic.profiles.push(profile);
                            });

                            if (this.profileResult.profiles.length > 0)
                                this.isFormExpanded = false;
                            //this.snackComp.showUnfinishedSnackBar(response["Message"]);
                        }
                    });
                }
            }
        }
    }

}
