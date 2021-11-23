import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { Contact } from '../users/users.model';
import { CanActivate, CanActivateChild } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { LocalStorageService } from 'angular-2-local-storage'
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';

@Injectable()
export class LoginService
{
    confirmDialogRef: MatDialogRef<DialogComponent>;
    serviceURL : String;
    public loggedUser : Contact;
    navigationModel : any;

    public googleUser: any; //gapi.auth2.GoogleUser

    constructor(private http: HttpClient, 
                private configSer : FuseConfigService, 
                private localStorageService: LocalStorageService,                
                public dialog: MatDialog,
                private router: Router)
    {
        this.serviceURL = configSer.ServiceURL;
        //this.navigationModel = fuseNavigationService.navigationModel.model;
    }

    openDialog(message)
    {                
        this.confirmDialogRef = this.dialog.open(DialogComponent, {
             disableClose: false
         });
  
        this.confirmDialogRef.componentInstance.data = message;  
    }

    getConfigurationData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL +'TDW/GetConfiguration')
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    resolve(response);
                }, reject);
            }
        );
    }
    
    syncUserData(email, img, firstname, lastname, name): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL +'User/SyncUser?email=' + email + '&imgurl=' + img + '&firstname=' + firstname + '&lastname=' + lastname + '&name=' + name)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }

    getLoginId()
    {
        var user = this.loggedUser;

        if (user == null || user == undefined || user.userid == null || user.userid == '0' || user.userid == '' || user.userid == undefined)
            this.googleUser.disconnect();
        else
            return this.loggedUser.userid;
    }

    getLoginToken() {
        var user = this.loggedUser;

        if (user == null || user == undefined || user.userid == null || user.userid == '0' || user.userid == '' || user.userid == undefined)
            this.googleUser.disconnect();
        else
            return this.loggedUser.token;
    }

    getHeaders()
    {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loggedUser.token
            })
        };
        return httpOptions;
    }
}

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

constructor(private authService: LoginService, 
            private fuseConfig: FuseConfigService,
            private fuseNavigationService : FuseNavigationService,
            private localStorageService: LocalStorageService, private router: Router) 
            {

            }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {

    //console.log('login check')
    //console.log(this.router.url)

    if(this.fuseNavigationService.findNavigationItemByURL(state.url) == null)
    {
        if ((this.router.url == "/users" && (state.url == "/user")) || (this.router.url == "/jobs" && (state.url == "/prioritizejob")))
        {

        }
        else
        {
            this.router.navigateByUrl(this.router.url)
            this.fuseConfig.setSettings({
                showProgress : false
            });
        }
    }
        
     if( this.localStorageService.get("login_id") == null && this.localStorageService.get("login_id") == undefined )
     {
          this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
            });

            if(this.authService.googleUser != null && this.authService.googleUser.isSignedIn())
                this.authService.googleUser.disconnect();
            
            this.router.navigate(['login']);
     }
    else if(this.authService.googleUser != null && !this.authService.googleUser.isSignedIn())
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });
        
        if( this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined )
            this.localStorageService.remove("login_id")

        this.router.navigate(['login']);
    }

    if (this.authService.loggedUser == undefined )
     {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
            });

        if( this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined )
            this.localStorageService.remove("login_id")

        if(this.authService.googleUser != null && this.authService.googleUser.isSignedIn())
            this.authService.googleUser.disconnect();
            
      this.router.navigate(['login']);
    }
    return true;
  }

  canActivateChild() {
    //console.log('checking child route access');
    return true;
  }

}
