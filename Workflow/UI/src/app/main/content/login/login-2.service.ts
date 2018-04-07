import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { Contact } from '../users/users.model';
import { CanActivate, CanActivateChild } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';


@Injectable()
export class Login2Service
{
    confirmDialogRef: MatDialogRef<DialogComponent>;
    serviceURL : String;
    public loggedUser : Contact;

    googleUser: gapi.auth2.GoogleUser

    constructor(private http: HttpClient, 
                private configSer : FuseConfigService, 
                public dialog: MatDialog,)
    {
        this.serviceURL = configSer.ServiceURL;
    
        
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
                this.http.get(this.serviceURL +'GetConfiguration')
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }
    getUserData(email, img, name): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL +'Login?email='+email+'&img='+img  +'&name='+name  )
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }

}
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

constructor(private authService: Login2Service, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (this.authService.loggedUser == undefined )
     {
         console.log('signout')

          //console.log('logout');
        if(this.authService.googleUser != null && this.authService.googleUser.isSignedIn)
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
