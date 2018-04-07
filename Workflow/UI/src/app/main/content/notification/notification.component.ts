import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { Notification } from './notification.model';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'fuse-mail',
    templateUrl: './notification.component.html',
    styleUrls  : ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy
{
    hasSelectedMails: boolean;
    isIndeterminate: boolean;
    folders: any[];
    filters: any[];
    labels: any[];
    searchInput: FormControl;
    currentMail: Notification;

    onSelectedMailsChanged: Subscription;
    onFoldersChanged: Subscription;
    onFiltersChanged: Subscription;
    onLabelsChanged: Subscription;
    onCurrentMailChanged: Subscription;

    constructor(
        private mailService: NotificationService,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService
        
    )
    {
        this.translate.use("en");
        this.searchInput = new FormControl('');
        this.translationLoader.loadTranslations(english, turkish);
    }

    ngOnInit()
    {
        this.onSelectedMailsChanged =
            this.mailService.onSelectedMailsChanged
                .subscribe(selectedMails => {

                    setTimeout(() => {
                        this.hasSelectedMails = selectedMails.length > 0;
                        this.isIndeterminate = (selectedMails.length !== this.mailService.mails.length && selectedMails.length > 0);
                    }, 0);
                });

        this.onFoldersChanged =
            this.mailService.onFoldersChanged
                .subscribe(folders => {
                    this.folders = this.mailService.folders;
                });

        this.onFiltersChanged =
            this.mailService.onFiltersChanged
                .subscribe(folders => {
                    this.filters = this.mailService.filters;
                });

        this.onLabelsChanged =
            this.mailService.onLabelsChanged
                .subscribe(labels => {
                    this.labels = this.mailService.labels;
                });

        this.onCurrentMailChanged =
            this.mailService.onCurrentMailChanged
                .subscribe(currentMail => {
                    if ( !currentMail )
                    {
                        this.currentMail = null;
                    }
                    else
                    {
                        this.currentMail = currentMail;
                    }
                });

        /*this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.mailService.onSearchTextChanged.next(searchText);
            });*/
    }

    ngOnDestroy()
    {
        this.onSelectedMailsChanged.unsubscribe();
        this.onFoldersChanged.unsubscribe();
        this.onFiltersChanged.unsubscribe();
        this.onLabelsChanged.unsubscribe();
        this.onCurrentMailChanged.unsubscribe();

    }

    toggleSelectAll()
    {
        this.mailService.toggleSelectAll();
    }

    selectMails(filterParameter?, filterValue?)
    {
        this.mailService.selectMails(filterParameter, filterValue);
    }

    deselectMails()
    {
        this.mailService.deselectMails();
    }

    deSelectCurrentMail()
    {
        this.mailService.onCurrentMailChanged.next(null);
    }

    toggleLabelOnSelectedMails(labelId)
    {
        this.mailService.toggleLabelOnSelectedMails(labelId);
    }

    setFolderOnSelectedMails(folderId)
    {
        this.mailService.setFolderOnSelectedMails(folderId);
    }
}
