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
var animations_1 = require("../../../core/animations");
var dialog_component_1 = require("../dialog/dialog.component");
var users_model_1 = require("../users/users.model");
var navigation_model_1 = require("../../../navigation.model");
var router_1 = require("@angular/router");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fuseConfig, localStorageService, formBuilder, element, snackBar, dialog, router, loginService, jobsService, fuseNavigationService, _ngZone, utilities) {
        // if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
        //     this.loginService.googleUser.disconnect();
        var _this = this;
        this.fuseConfig = fuseConfig;
        this.localStorageService = localStorageService;
        this.formBuilder = formBuilder;
        this.element = element;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.jobsService = jobsService;
        this.fuseNavigationService = fuseNavigationService;
        this._ngZone = _ngZone;
        this.utilities = utilities;
        ////private scope = ['profile', 'email', 'https://www.googleapis.com/auth/indexing'].join(' ');
        this.scope = ['profile', 'email'].join(' ');
        this.loginFormErrors = {
            email: {},
            password: {}
        };
        this.deploymentNotificationMessage = '';
        this.login = new Login({});
        this.loginService.loggedUser = new users_model_1.Contact({});
        this.loginService.getConfigurationData().then(function (data) {
            if (data == "" || data == undefined) {
                _this.myClientId = fuseConfig.GoogleClientID + '.apps.googleusercontent.com';
            }
            else {
                _this.myClientId = data["GoogleClientID"];
                _this.fuseConfig.GoogleClientID = data["GoogleClientID"];
                _this.deploymentNotificationMessage = data["DeploymentNotificationMessage"];
                _this.fuseConfig.JobTimerDuration = data["JobTimerDuration"];
                _this.fuseConfig.AlertTimerDuration = data["AlertTimerDuration"];
                /*
                    //// Value comes from API - 11/19/2021
                    this.fuseConfig.helpDeskURL = "https://goo.gl/forms/d19uhpWwomYr0wx22"
                    this.fuseConfig.staffDirectoryURL = "https://docs.google.com/spreadsheets/d/106gBhrqH2gws2EqXpvrMfQJRtF7vTbKLkT5SO_iKwxo/edit?usp=sharing"
                */
                _this.fuseConfig.helpDeskURL = data["HelpDeskURL"];
                _this.fuseConfig.staffDirectoryURL = data["StaffDirectoryURL"];
                //this.myClientId = "401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et";
            }
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loginForm = this.formBuilder.group({
            email: [this.login.email, [forms_1.Validators.required, forms_1.Validators.email]],
            password: [this.login.password, forms_1.Validators.required]
        });
        this.loginForm.valueChanges.subscribe(function () {
            _this.onLoginFormValuesChanged();
        });
        this.fuseConfig.setSettings({
            showProgress: false,
            layout: {
                navigation: 'none',
                toolbar: 'none',
                footer: 'none'
            }
        });
        this.googleInit();
    };
    LoginComponent.prototype.googleInit = function () {
        var that = this;
        var counter = 0;
        gapi.load('auth2', function () {
            /**
             * Retrieve the singleton for the GoogleAuth library and set up the
             * client.
             */
            //private clientId:string = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';  // localhost
            //private clientId:string = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com'; // live
            /* Getting client id is now comes from server. */
            ////let clientId = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';
            /* Below clientId is from my google a/c (Raja) - Web client (Auto-created for Google Sign-in) */
            var clientId = '753784829804-ea3bc3vjqj2c5e7bc003710d3j8k1jks.apps.googleusercontent.com';
            if (window.location.hostname != 'localhost')
                clientId = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com';
            //let clientId = that.myClientId + '.apps.googleusercontent.com';
            that.auth2 = gapi.auth2.init({
                client_id: clientId,
                scope: that.scope
            });
            // Listen for sign-in state changes.
            that.auth2.isSignedIn.listen(function (isSigned) {
                if (!isSigned) {
                    that.router.navigateByUrl('/login');
                }
            });
            // Listen for changes to current user.
            that.auth2.currentUser.listen(function (googleUser) {
                /* Commenting && googleUser["El"] != null && googleUser["Zi"] != null && counter < 1), since the google return codes are changed. */
                if (googleUser != null && googleUser != undefined && counter < 1) {
                    counter = counter + 1;
                    var profile = googleUser.getBasicProfile();
                    that.loginService.googleUser = googleUser;
                    that.router.events.subscribe(function (event) {
                        if (event instanceof router_1.NavigationStart) {
                            that.fuseConfig.setSettings({
                                showProgress: true
                            });
                        }
                        if (event instanceof router_1.NavigationEnd) {
                            that.fuseConfig.setSettings({
                                showProgress: false
                            });
                        }
                        if (event instanceof router_1.NavigationError) {
                            that.fuseConfig.setSettings({
                                showProgress: false
                            });
                            that.openDialog('Error', 'Error occurred. Please contact your administrator!');
                        }
                    });
                    var loggedUser = that.loginService.googleUser.getBasicProfile();
                    that.login.email = loggedUser.getEmail();
                    var loginModel = {
                        "email": loggedUser.getEmail(),
                        "firstname": loggedUser.getGivenName(),
                        "lastname": loggedUser.getFamilyName(),
                        "name": loggedUser.getName(),
                        "imgurl": loggedUser.getImageUrl()
                    };
                    //that.loginService.syncUserData(JSON.stringify(loginModel)).then(response =>{
                    that.loginService.syncUserData(loggedUser.getEmail(), loggedUser.getImageUrl(), loggedUser.getGivenName(), loggedUser.getFamilyName(), loggedUser.getName()).then(function (response) {
                        if (response != null) {
                            if (response["Result"] == "1") {
                                that._ngZone.run(function () {
                                    response = JSON.parse(response["Message"]);
                                    that.loginService.loggedUser = response;
                                    that.localStorageService.set("login_id", that.loginService.googleUser.getId());
                                    localStorage.setItem('userToken', that.loginService.loggedUser.token);
                                    var role = that.loginService.loggedUser.rolename;
                                    if (role == that.utilities.rn_teamlead || role == that.utilities.rn_deliverymanager || role == that.utilities.rn_superuser) {
                                        // synch jobs
                                        ////that.jobsService.synchJobs().then(response =>
                                        ////{
                                        ////    ////if (response) {
                                        ////    ////    that.jobsService.getNewJobs();
                                        ////    ////}
                                        ////});
                                    }
                                    that.fuseNavigationService.navigationModel = new navigation_model_1.NavigationModel();
                                    that.navigateStartPage();
                                });
                            }
                            else {
                                that._ngZone.run(function () {
                                    that.fuseConfig.setSettings({
                                        showProgress: false
                                    });
                                    if (response["Result"] == "0") {
                                        that.openDialog('Access Denied', 'You are not authorized to access this site or your role has not been set. Please contact your administrator!');
                                    }
                                    else {
                                        that.openDialog('Login failed', 'There is an issue in sign-in to this site. Please try again later or contact your administrator!');
                                    }
                                    that.loginService.loggedUser = undefined;
                                    that.loginService.googleUser.disconnect();
                                });
                            }
                        }
                    }).catch(function (ex) {
                        that._ngZone.run(function () {
                            that.fuseConfig.setSettings({
                                showProgress: false
                            });
                            that.openDialog('Login failed', 'Something went wrong. Please try again later or contact your administrator!');
                        });
                    });
                }
                else {
                    that.fuseConfig.setSettings({
                        showProgress: false,
                        layout: {
                            navigation: 'none',
                            toolbar: 'none',
                            footer: 'none'
                        }
                    });
                }
            });
            // Sign in the user if they are currently signed in.
            if (that.auth2.isSignedIn.get() == true) {
                that.auth2.signIn();
            }
            // Attach the click handler to the sign-in button
            that.auth2.attachClickHandler(that.element.nativeElement.firstChild, {}, function (googleUser) { }, function (error) {
                that._ngZone.run(function () {
                    that.fuseConfig.setSettings({
                        showProgress: false
                    });
                    console.log('In Error');
                    that.openDialog('Access Denied', 'You are not authorized to access this site. Please contact your administrator!');
                });
            });
        });
    };
    LoginComponent.prototype.navigateStartPage = function () {
        if (this.loginService.loggedUser != null && this.loginService.loggedUser != undefined) {
            // 1	Recruiter
            // 2	Team Lead
            // 3	Delivery Manager
            // 4	Report User
            // 5	Super User
            if (this.loginService.loggedUser.rolename == "" || this.loginService.loggedUser.rolename == undefined) {
                this.fuseConfig.setSettings({
                    showProgress: false,
                    layout: {
                        navigation: 'none',
                        toolbar: 'none',
                        footer: 'none'
                    }
                });
                //this.router.navigate(['/login']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_recruiter) {
                this.fuseNavigationService.removeMenu("newjobs");
                this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("reports");
                this.fuseNavigationService.removeMenu("accountreports");
                this.fuseNavigationService.removeMenu("accounts");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.removeMenu("customervendor");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/myjobs']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_teamlead) {
                this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("accounts");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.removeMenu("customervendor");
                this.fuseNavigationService.removeMenu("accountreports");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/jobs']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_deliverymanager) {
                this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("recruiters");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("customervendor");
                this.fuseNavigationService.removeMenu("accounts");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.removeMenu("accountreports");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/jobs']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_reportuser) {
                this.fuseNavigationService.removeMenu("newjobs");
                this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("recruiters");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("priorityjob");
                this.fuseNavigationService.removeMenu("customervendor");
                this.fuseNavigationService.removeMenu("accounts");
                this.fuseNavigationService.removeMenu("accountreports");
                this.fuseNavigationService.removeMenu("tools");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/jobreport']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_superuser) {
                this.fuseNavigationService.removeMenu("recruiters");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/jobs']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_accountsadmin) {
                this.fuseNavigationService.removeMenu("newjobs");
                //this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("recruiters");
                //this.fuseNavigationService.removeMenu("reports");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("priorityjob");
                this.fuseNavigationService.removeMenu("tools");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/consultants']);
            }
            else if (this.loginService.loggedUser.rolename == this.utilities.rn_accountsclerk) {
                this.fuseNavigationService.removeMenu("newjobs");
                this.fuseNavigationService.removeMenu("users");
                this.fuseNavigationService.removeMenu("recruiters");
                this.fuseNavigationService.removeMenu("reports");
                this.fuseNavigationService.removeMenu("jobsclient");
                this.fuseNavigationService.removeMenu("priorityjob");
                this.fuseNavigationService.removeMenu("customervendor");
                this.fuseNavigationService.removeMenu("tools");
                this.fuseNavigationService.removeMenu("admintools");
                this.fuseNavigationService.removeChildMenu("accounts", "consultants");
                this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                this.router.navigate(['/invoices']);
            }
            else {
                this.fuseConfig.setSettings({
                    showProgress: false,
                    layout: {
                        navigation: 'none',
                        toolbar: 'none',
                        footer: 'none'
                    }
                });
                //this.router.navigate(['/login']);
            }
        }
        else {
            this.fuseConfig.setSettings({
                showProgress: false,
                layout: {
                    navigation: 'none',
                    toolbar: 'none',
                    footer: 'none'
                }
            });
        }
    };
    LoginComponent.prototype.checkLoingStatus = function () {
        if (this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn()) {
            this.navigateStartPage();
        }
        else if (this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined) {
            this.navigateStartPage();
        }
    };
    LoginComponent.prototype.submitLogin = function () {
        this.fuseConfig.setSettings({
            showProgress: true
        });
    };
    LoginComponent.prototype.openDialog = function (title, message) {
        this.dialog.open(dialog_component_1.DialogComponent, {
            width: '550px',
            data: {
                title: title,
                message: message
            }
        });
    };
    LoginComponent.prototype.onLoginFormValuesChanged = function () {
        for (var field in this.loginFormErrors) {
            if (!this.loginFormErrors.hasOwnProperty(field)) {
                continue;
            }
            // Clear previous errors
            this.loginFormErrors[field] = {};
            // Get the control
            var control = this.loginForm.get(field);
            if (control && control.dirty && !control.valid) {
                this.loginFormErrors[field] = control.errors;
            }
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'fuse-login-2',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            animations: animations_1.fuseAnimations
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
var Login = /** @class */ (function () {
    function Login(login) {
        this.email = login.email || '';
        this.password = login.password || '';
    }
    return Login;
}());
exports.Login = Login;
