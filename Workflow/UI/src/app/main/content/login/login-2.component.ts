import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';

import { Contact } from '../users/users.model';
import { Login2Service } from './login-2.service';
import { GoogleSignInSuccess } from 'angular-google-signin';
import { NgZone } from '@angular/core';
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';
import { NavigationModel } from '../../../navigation.model';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { JobsService } from '../jobs/jobs.service';

@Component({
    selector   : 'fuse-login-2',
    templateUrl: './login-2.component.html',
    styleUrls  : ['./login-2.component.scss'],
    animations : fuseAnimations
})
export class FuseLogin2Component implements OnInit
{

    loginForm: FormGroup;
    loginFormErrors: any;
   
    login : Login;

    private myClientId: string;
 

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        public router : Router,
        private loginService : Login2Service,
        private jobsService: JobsService,
        private fuseNavigationService : FuseNavigationService,
        private _ngZone: NgZone
    )
    {

         if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn)
            this.loginService.googleUser.disconnect();


        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        this.login = new Login({});

        this.loginService.loggedUser = new Contact({});

        this.loginService.getConfigurationData().then(data => {

            if(data == "" || data == undefined )
                this.myClientId = fuseConfig.GoogleClientID +'.apps.googleusercontent.com';
            else
                this.myClientId = data["GoogleClientID"]

        });
        

        // this.errorMessage1 = "";
        // this.errorMessage2 = "";
    }

    onGoogleSignInSuccess(event: GoogleSignInSuccess) {
        //let googleUser: gapi.auth2.GoogleUser = event.googleUser;
        this.loginService.googleUser = event.googleUser;
        //let id: string = this.loginService.googleUser.getId();
        //let profile: gapi.auth2.BasicProfile = this.loginService.googleUser.getBasicProfile();
        //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //console.log('Name: ' + profile.getName());

        this.router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                     this.fuseConfig.setSettings({
                            showProgress : true
                        });
                }
                if ( event instanceof NavigationEnd )
                {
                     this.fuseConfig.setSettings({
                        showProgress : false
                    });
                }
            });

        //console.log()
        this.login.email = this.loginService.googleUser.getBasicProfile().getEmail();

        this.loginService.getUserData(this.login.email, this.loginService.googleUser.getBasicProfile().getImageUrl(), this.loginService.googleUser.getBasicProfile().getName()).then(response =>{
            //console.log(response)
            if(response != null)
            {
                if(response["Result"] == "1")
                {
                    this._ngZone.run(() => {
                        response = JSON.parse(response["Message"]);
                        //console.log('user data')
                        this.loginService.loggedUser = response["Table"][0];
                        console.log(this.loginService.loggedUser)


                        // synch jobs
                        this.jobsService.synchJobs()
                        .then(response => {
                            //console.log(response)
                            if (response)
                            {

                                this.jobsService.getNewJobs();

                                if(response["Result"]=="1")
                                {
                                    //this.router.navigateByUrl('/jobs');
                                    //this.openDialog(response["Message"]);
                                }
                                else
                                {
                                    //this.openDialog(response["Message"]);
                                }
                            }
                        });

                        this.fuseNavigationService.navigationModel = new NavigationModel();
                        //console.log( this.fuseNavigationService.navigationModel.model)

                        // 1	Recruiter
                        // 2	Team Lead
                        // 3	Delivery Manager
                        // 4	Report User
                        // 5	Super User
                        
                        // console.log('logged')

                        if(this.loginService.loggedUser.roleid == "1") //Recruiter
                        {
                            this.fuseNavigationService.removeMenu("newjobs");    
                            this.fuseNavigationService.removeMenu("jobs");    
                            this.fuseNavigationService.removeMenu("users");    
                            this.fuseNavigationService.removeMenu("assignusers");   
                            this.fuseNavigationService.removeMenu("reports");  
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/recruiters']);
                        }
                        else if(this.loginService.loggedUser.roleid == "2")//Team Lead
                        {
                            this.fuseNavigationService.removeMenu("assignusers");    
                            this.fuseNavigationService.removeMenu("reports");    
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                        else if(this.loginService.loggedUser.roleid == "3")//Delivery Manager
                        {
                            this.fuseNavigationService.removeMenu("assignusers");    
                            this.fuseNavigationService.removeMenu("reports");    
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                        else if(this.loginService.loggedUser.roleid == "4")//Report User
                        {
                            this.fuseNavigationService.removeMenu("newjobs");    
                            this.fuseNavigationService.removeMenu("jobs");    
                            this.fuseNavigationService.removeMenu("users");    
                            this.fuseNavigationService.removeMenu("assignusers");    
                            this.fuseNavigationService.removeMenu("recruiters");   
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/report1']);
                        }
                        else if(this.loginService.loggedUser.roleid == "5")//Super User
                        {
                            console.log('navigate to jobload')
                            this.fuseNavigationService.onNavigationModelChange.next(this.fuseNavigationService.navigationModel.model);
                            this.router.navigate(['/jobsload']);
                        }
                    });
                }
                else
                {
                    this._ngZone.run(() => {
                    this.loginService.openDialog(response["Message"]);
                    this.loginService.loggedUser = undefined;
                    this.loginService.googleUser.disconnect();
                     });
                    
                }
            }
        });
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