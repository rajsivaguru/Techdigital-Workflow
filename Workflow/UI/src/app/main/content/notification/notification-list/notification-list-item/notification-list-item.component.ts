import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '../../notification.model';
import { NotificationService } from '../../notification.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector   : 'fuse-mail-list-item',
    templateUrl: './notification-list-item.component.html',
    styleUrls  : ['./notification-list-item.component.scss']
})
export class NotificationListItemComponent implements OnInit, OnDestroy
{
    @Input() mail: Notification;
    labels: any[];
    @HostBinding('class.selected') selected: boolean;

    onSelectedMailsChanged: Subscription;
    onLabelsChanged: Subscription;

    constructor(
        private mailService: NotificationService
    )
    {
    }

    ngOnInit()
    {
        // Set the initial values
        this.mail = new Notification(this.mail);

        // Subscribe to update on selected mail change
        this.onSelectedMailsChanged =
            this.mailService.onSelectedMailsChanged
                .subscribe(selectedMails => {
                    this.selected = false;

                    if ( selectedMails.length > 0 )
                    {
                        for ( const mail of selectedMails )
                        {
                            if ( mail.id === this.mail.id )
                            {
                                this.selected = true;
                                break;
                            }
                        }
                    }
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
        this.onSelectedMailsChanged.unsubscribe();
    }

    onSelectedChange()
    {
        //console.log('selected');
        this.mailService.toggleSelectedMail(this.mail.id);
    }

    /**
     * Toggle star
     * @param event
     */
    toggleStar(event)
    {
        event.stopPropagation();

        this.mail.toggleStar();

        this.mailService.updateMail(this.mail);
    }

    /**
     * Toggle Important
     * @param event
     */
    toggleImportant(event)
    {
        event.stopPropagation();

        this.mail.toggleImportant();

        this.mailService.updateMail(this.mail);
    }
}
