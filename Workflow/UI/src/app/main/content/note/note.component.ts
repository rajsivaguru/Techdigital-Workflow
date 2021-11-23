import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '../../../core/animations';
import { FuseUtils } from '../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ProgressBarConfig } from '../../../app.model';
import { LoginService } from '../login/login.service';
import { SnackBarService } from '../dialog/snackbar.service'
import { NoteService } from '../note/note.service';
import { NoteQuestion } from './note.model';
import { DialogComponent, DialogDataComponent } from '../dialog/dialog.component'
import { Utilities } from '../common/commonUtil';

@Component({
    selector: 'note-from',
    templateUrl: './note-form.component.html',
    //styleUrls: ['./jobs-client.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class NoteFormComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    progressbar: ProgressBarConfig;
    searchInput: FormControl;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    datePipe = new DatePipe("en-US");
    matTableInner: number;

    questionList = [];    
    todayDate = new Date();
    maxFromDate = null;
    canPreview: boolean = false;

    constructor(
        public dialog: MatDialog,
        private confirmDialog: MatDialog,
        private noteService: NoteService,
        public router: Router,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.searchInput = new FormControl('');
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new ProgressBarConfig({});
        this.getQuestionList();
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }
    
    openModal(question: any, optionlist, selectedusers) {
        let options = [];

        optionlist.forEach(item => {
            options.push({ "id": item.optionid, "itemName": item.option });
        })

        let dialogUserList = this.dialog.open(DialogDataComponent, {
            height: "550px",
            width: "400px",
            data: {
                title: 'Select Options',
                userList: options,
                selectedUsers: selectedusers,
                groupByField: ''
            }
        });

        dialogUserList.afterClosed().subscribe(result => {
            if (result == undefined) {
                //question.response = '';
            }
            else if (result.length > 0)
            {
                question.response = '';
                question.selectedoptions = result;

                result.forEach(item => {
                    question.response += item.itemName + ', ';
                });

                if (question.response.endsWith(', '))
                {
                    question.response = question.response.substr(0, question.response.trim().length - 1);
                }
            }
            else {
                question.selectedoptions = [];
                question.response = '';
            }
        });
    }
    
    rating(question, index)
    {
        if (index == question.response)
            question.response = 0;
        else
            question.response = index;
    }

    clearForm() {
        this.questionList.forEach((x) => {
            if (x.type == 'Rating')
                x.response = 0;
            else
                x.response = '';
        });
    }

    copyToClipboard() {
        var textarea = document.createElement('textarea');
        textarea.textContent = document.getElementById('divForm').innerText;
        document.body.appendChild(textarea);

        var selection = document.getSelection();
        var range = document.createRange();
        range.selectNode(textarea);
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
        }
        catch (error) {
            this.snackComp.showSimpleWarning('Does not support/failed copying the summary.  Please press Ctrl/Cmd + C to copy.');
        }

        selection.removeAllRanges();
        document.body.removeChild(textarea);
    }
    
    private getQuestionList() {
        this.noteService.getQuestionList().then(response => {
            if (response) {
                this.questionList = response;
            }
        });
    }

    /*Not Used. */
    dateChanged(question) {
        question.response = this.datePipe.transform(question.response, 'MM/dd/yyyy');
    }

}
