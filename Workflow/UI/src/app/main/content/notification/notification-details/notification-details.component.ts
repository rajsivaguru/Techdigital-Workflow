import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification.model';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../core/animations';

@Component({
    selector   : 'fuse-mail-details',
    templateUrl: './notification-details.component.html',
    styleUrls  : ['./notification-details.component.scss'],
    animations : fuseAnimations
})
export class NotificationDetailsComponent implements OnInit, OnDestroy
{
    mail: Notification;
    labels: any[];
    showDetails = false;

    onCurrentMailChanged: Subscription;
    onLabelsChanged: Subscription;

    constructor(
        private mailService: NotificationService
    )
    {
    }

    ngOnInit()
    {
        // Subscribe to update the current mail
        this.onCurrentMailChanged =
            this.mailService.onCurrentMailChanged
                .subscribe(currentMail => {
                    this.mail = currentMail;
                });

        // Subscribe to update on label change
        this.onLabelsChanged =
            this.mailService.onLabelsChanged
                .subscribe(labels => {
                    this.labels = labels;
                });
    }

    ngOnDestroy()
    {
        this.onCurrentMailChanged.unsubscribe();
    }

    toggleStar(event)
    {
        event.stopPropagation();

        this.mail.toggleStar();

        this.mailService.updateMail(this.mail);
    }

    toggleImportant(event)
    {
        event.stopPropagation();

        this.mail.toggleImportant();

        this.mailService.updateMail(this.mail);
    }

}
