import { Component, AfterViewInit, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import { MatSnackBar } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component'
import { Contact } from '../users/users.model';
import { LoginService } from './login.service';
//import { GoogleSignInSuccess } from 'angular-google-signin';
import { NgZone } from '@angular/core';
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';
import { NavigationModel } from '../../../navigation.model';
import { NavigationEnd, NavigationStart, NavigationError, Router } from '@angular/router';
import { JobsService } from '../jobs/jobs.service';

import { LocalStorageService } from 'angular-2-local-storage'

declare const gapi: any;

@Component({
    selector   : 'fuse-login-2',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class LoginComponent implements OnInit, AfterViewInit
{

    loginForm: FormGroup;
    loginFormErrors: any;
   
    login : Login;

    private myClientId: string;

    //private clientId:string = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';  // localhost
    //private clientId:string = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com'; // live
  
  private scope = [
    'profile',
    'email'
  ].join(' ');

  public auth2: any;
  public googleInit() {
    let that = this;

    try
    {
        if( gapi != undefined)
        {
            gapi.load('auth2', function () {
            that.auth2 = gapi.auth2.init({
                client_id: that.myClientId,
                //cookiepolicy: 'single_host_origin',
                scope: that.scope
            });
            that.attachSignin(that.element.nativeElement.firstChild);
            });
        }
    }
    catch(ex)
    {
        console.log(ex)
        this.fuseConfig.setSettings({
            showProgress : false,
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });
    }
  }
  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE

        
        that.loginService.googleUser = googleUser;
        //let id: string = this.loginService.googleUser.getId();
        //let profile: gapi.auth2.BasicProfile = this.loginService.googleUser.getBasicProfile();
        //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //console.log(event.googleUser);



        that.router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                     that.fuseConfig.setSettings({
                            showProgress : true
                        });
                }
                if ( event instanceof NavigationEnd )
                {
                     that.fuseConfig.setSettings({
                        showProgress : false
                    });
                }
                if ( event instanceof NavigationError )
                {
                     that.fuseConfig.setSettings({
                        showProgress : false
                    });

                    that.openDialog('Error', 'Error occurred. Please contact your administrator!');
                }

                
            });

        //console.log()
        that.login.email = that.loginService.googleUser.getBasicProfile().getEmail();

        that.loginService.getUserData(that.login.email, that.loginService.googleUser.getBasicProfile().getImageUrl(), that.loginService.googleUser.getBasicProfile().getName()).then(response =>{
            //console.log(response)
            if(response != null)
            {
                if(response["Result"] == "1")
                {
                    that._ngZone.run(() => {
                        response = JSON.parse(response["Message"]);
                        //console.log('user data')
                        that.loginService.loggedUser = response["Table"][0];
                        //console.log(that.loginService.loggedUser)

                        that.localStorageService.set("login_id", that.loginService.googleUser.getId() )
                        // synch jobs
                        that.jobsService.synchJobs()
                        .then(response => {
                            //console.log(response)
                            if (response)
                            {

                                that.jobsService.getNewJobs();

                                if(response["Result"]=="1")
                                {
                                    //that.router.navigateByUrl('/jobs');
                                    //that.openDialog(response["Message"]);
                                }
                                else
                                {
                                    //that.openDialog(response["Message"]);
                                }
                            }
                        });

                        that.fuseNavigationService.navigationModel = new NavigationModel();
                        //console.log( that.fuseNavigationService.navigationModel.model)
                        // console.log('logged')

                        that.navigateStartPage();
                    });
                }
                else
                {
                    that._ngZone.run(() => {
                         that.fuseConfig.setSettings({
                            showProgress : false
                        });
                        //that.openDialog(response["Message"]);
                        that.openDialog('Access Denied', 'You are not authorized to access this site. Please contact your administrator!');
                        that.loginService.loggedUser = undefined;
                        that.loginService.googleUser.disconnect();
                     });
                    
                }
            }
        }).catch( ex =>{

             that._ngZone.run(() => {
                         that.fuseConfig.setSettings({
                            showProgress : false
                        });
                        //that.openDialog(response["Message"]);
                        that.openDialog('Access Denied', 'You are not authorized to access this site. Please contact your administrator!');
                     });
        });

      }, function (error) {
            that._ngZone.run(() => {
                         that.fuseConfig.setSettings({
                            showProgress : false
                        });
                        //that.openDialog(response["Message"]);
                        that.openDialog('Access Denied', 'You are not authorized to access this site. Please contact your administrator!');
                     });
      });
  }
 ngAfterViewInit() {
    this.googleInit();
  }


    constructor(
        private fuseConfig: FuseConfigService,
        private localStorageService: LocalStorageService,
        private formBuilder: FormBuilder,
        private element: ElementRef,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public router : Router,
        public loginService : LoginService,
        private jobsService: JobsService,
        private fuseNavigationService : FuseNavigationService,
        private _ngZone: NgZone
    )
    {

        

        this.fuseConfig.setSettings({
            showProgress : false,
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });
        
        // if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
        //     this.loginService.googleUser.disconnect();
        
        
        //console.log(this.loginService.googleUser)

        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        this.login = new Login({});

        this.loginService.loggedUser = new Contact({});

        this.loginService.getConfigurationData().then(data => {

            if(data == "" || data == undefined )
            {
                this.myClientId = fuseConfig.GoogleClientID +'.apps.googleusercontent.com';
               
            }
            else
            {
                this.myClientId = data["GoogleClientID"]
                this.fuseConfig.JobTimerDuration = data["JobTimerDuration"]
                this.fuseConfig.AlertTimerDuration = data["AlertTimerDuration"]
                //this.myClientId = "401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et";
            }

        });
        

        // this.errorMessage1 = "";
        // this.errorMessage2 = "";
    }
    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            email   : [this.login.email, [Validators.required, Validators.email]],
            password: [this.login.password, Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });

        this.checkLoingStatus();
    }


    // onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    //     //let googleUser: gapi.auth2.GoogleUser = event.googleUser;
    //     this.loginService.googleUser = event.googleUser;
    //     //let id: string = this.loginService.googleUser.getId();
    //     //let profile: gapi.auth2.BasicProfile = this.loginService.googleUser.getBasicProfile();
    //     //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     //console.log(event.googleUser);



    //     this.router.events.subscribe(
    //         (event) => {
    //             if ( event instanceof NavigationStart )
    //             {
    //                  this.fuseConfig.setSettings({
    //                         showProgress : true
    //                     });
    //             }
    //             if ( event instanceof NavigationEnd )
    //             {
    //                  this.fuseConfig.setSettings({
    //                     showProgress : false
    //                 });
    //             }
    //         });

    //     //console.log()
    //     this.login.email = this.loginService.googleUser.getBasicProfile().getEmail();

    //     this.loginService.getUserData(this.login.email, this.loginService.googleUser.getBasicProfile().getImageUrl(), this.loginService.googleUser.getBasicProfile().getName()).then(response =>{
    //         //console.log(response)
    //         if(response != null)
    //         {
    //             if(response["Result"] == "1")
    //             {
    //                 this._ngZone.run(() => {
    //                     response = JSON.parse(response["Message"]);
    //                     //console.log('user data')
    //                     this.loginService.loggedUser = response["Table"][0];
    //                     //console.log(this.loginService.loggedUser)

    //                     this.localStorageService.set("login_id", this.loginService.googleUser.getId() )
    //                     // synch jobs
    //                     this.jobsService.synchJobs()
    //                     .then(response => {
    //                         //console.log(response)
    //                         if (response)
    //                         {

    //                             this.jobsService.getNewJobs();

    //                             if(response["Result"]=="1")
    //                             {
    //                                 //this.router.navigateByUrl('/jobs');
    //                                 //this.openDialog(response["Message"]);
    //                             }
    //                             else
    //                             {
    //                                 //this.openDialog(response["Message"]);
    //                             }
    //                         }
    //                     });

    //                     this.fuseNavigationService.navigationModel = new NavigationModel();
    //                     //console.log( this.fuseNavigationService.navigationModel.model)
    //                     // console.log('logged')

    //                     this.navigateStartPage();
    //                 });
    //             }
    //             else
    //             {
    //                 this._ngZone.run(() => {
    //                      this.fuseConfig.setSettings({
    //                         showProgress : false
    //                     });
    //                     //this.openDialog(response["Message"]);
    //                     this.openDialog('You are not authorized to access this site. Please contact your administrator!');
    //                     this.loginService.loggedUser = undefined;
    //                     this.loginService.googleUser.disconnect();
    //                  });
                    
    //             }
    //         }
    //     });
    // }


    navigateStartPage()
    {
         if(this.loginService.loggedUser != null && this.loginService.loggedUser != undefined)
         {
                        // 1	Recruiter
                        // 2	Team Lead
                        // 3	Delivery Manager
                        // 4	Report User
                        // 5	Super User
                        if(this.loginService.loggedUser.roleid == "1") //Recruiter
                        {
                            this.fuseNavigationService.removeMenu("newjobs");    
                            this.fuseNavigationService.removeMenu("users");    
                            this.fuseNavigationService.removeMenu("reports");  
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/myjobs']);
                        }
                        else if(this.loginService.loggedUser.roleid == "2")//Team Lead
                        {
                            this.fuseNavigationService.removeMenu("users");     
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                        else if(this.loginService.loggedUser.roleid == "3")//Delivery Manager
                        {
                            this.fuseNavigationService.removeMenu("users");     
                            this.fuseNavigationService.removeMenu("recruiters");  
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                        else if(this.loginService.loggedUser.roleid == "4")//Report User
                        {
                            this.fuseNavigationService.removeMenu("newjobs");    
                            this.fuseNavigationService.removeMenu("users");    
                            this.fuseNavigationService.removeMenu("recruiters");   
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobreport']);
                        }
                        else if(this.loginService.loggedUser.roleid == "5")//Super User
                        {
                            this.fuseNavigationService.removeMenu("recruiters");   
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                        else 
                        {
                            this.fuseConfig.setSettings({
                                showProgress : false,
                                layout: {
                                    navigation: 'none',
                                    toolbar   : 'none',
                                    footer    : 'none'
                                }
                            });
                            this.router.navigate(['/login']);
                        }
         }
         else
        {
            this.fuseConfig.setSettings({
                showProgress : false,
                layout: {
                    navigation: 'none',
                    toolbar   : 'none',
                    footer    : 'none'
                }
            });
        }
    }
    checkLoingStatus()
    {
        
        if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
        {
            this.navigateStartPage();
        }
        else if( this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined )
        {
            this.navigateStartPage();
        }

    }
    submitLogin()
    {
        this.fuseConfig.setSettings({
            showProgress : true
        });
        // if(!this.loginForm.valid)
        // return;
        // this.login = this.loginForm.getRawValue();

        // this.loginService.getUserData(this.login.email, "","").then(response =>{
        //     //console.log(response["Message"])
        //     if( response["Result"] == "1")
        //     {
        //         response = JSON.parse(response["Message"]);
        //         //console.log(response["Table"][0])
        //         this.loginService.loggedUser = response["Table"][0];
        //         //console.log(this.loginService.loggedUser)
        //         this.router.navigateByUrl('/jobsload');
        //     }
        //     else
        //     {
                
        //         this.loginService.openDialog(response["Message"]);
        //         this.loginService.loggedUser = undefined;

        //     }
        // });
        
    }
    openDialog(title, message) : void
    {
        // this.snackBar.open(message, '', {
        //     duration: 2000,
        //     verticalPosition : 'top',
        //     extraClasses: ['mat-light-blue-100-bg']


        // });

         this.dialog.open(DialogComponent, {
            width: '550px',
            data: { 
                title : title,
                message : message 
            }
            });



    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    

 
}

export class Login
{
    email : string;
    password : string;

    constructor(login)
    {
        this.email = login.email || '';
        this.password = login.password || '';
          
    }

}