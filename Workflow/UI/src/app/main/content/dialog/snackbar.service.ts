import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class SnackBarService {
    constructor(public snackBar: MatSnackBar) { }

    showUnfinishedSnackBar(message): void {
        this.showUnfinished(message, '');
    }
    
    showSimpleNotificationSnackBar(message): void {
        this.showNotification(message, '');
    }

    showSimpleSnackBar(message): void {
        this.showSuccess(message, '');
    }

    showSimpleWarning(message): void {
        this.showWarning(message, '');
    }

    showSnackBar(status, message, action): void {
        if (status == "1")
            this.showSuccess(message, action);
        else
            this.showError(message, action);
    }

    showSnackBarGet(response: any, action: string): void {
        if (response["ResultStatus"] == "-1" || response["ResultStatus"] == "-2" || response["ResultStatus"] == "-3")
            this.showError(response["ErrorMessage"], action);
    }

    showSnackBarPost(response: any, action: string): void {
        if (response["ResultStatus"] == "1")
            this.showSuccess(response["SuccessMessage"], action);
        else if (response["ResultStatus"] == "-2")
            this.showWarning(response["ErrorMessage"], action);
        else
            this.showError(response["ErrorMessage"] != undefined ? response["ErrorMessage"] :
                response["Message"] != undefined && response["Message"].indexOf('No HTTP') >= 0 ? 'Valid API method is not found.' : response["Message"], action);
    }


    private showNotification(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 7000,
            verticalPosition: 'top',
            extraClasses: ['snackbar-notification']
        });
    }

    private showSuccess(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-success']
        });
    }

    private showError(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 7000,
            verticalPosition: 'top',
            extraClasses: ['snackbar-error']
        });
    }

    private showWarning(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-warning']
        });
    }

    private showUnfinished(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2500,
            verticalPosition: 'top',
            extraClasses: ['snackbar-unfinished']
        });
    }
}