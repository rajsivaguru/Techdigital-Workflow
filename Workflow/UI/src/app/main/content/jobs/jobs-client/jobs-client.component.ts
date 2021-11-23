import { Component,Inject,  OnDestroy, OnInit, ElementRef,TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '../../../../core/animations';
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ProgressBarConfig } from '../../../../app.model';
import { LoginService } from '../../login/login.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { Client } from '../jobs.model';
import { JobsService } from '../jobs.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector     : 'clients',
    templateUrl  : './jobs-client.component.html',
    styleUrls    : ['./jobs-client.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class JobsClientComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    clients : any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['jn_clientname', 'jn_shortcode', 'jn_buttons'];
    progressbar: ProgressBarConfig;
    searchInput: FormControl;
    isFormExpanded: boolean = true;
    isSavable: boolean = false;
    clientFormGroup : FormGroup;
    clientForm: Client;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    matTableInner: number;

    constructor(
        private confirmDialog: MatDialog,
        private jobsService: JobsService,
        public router : Router,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl('');
        this.clientForm = new Client ({});
    }

    ngOnInit()
    {        
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new ProgressBarConfig({});
        this.clientFormGroup = this.createClientForm();
        this.dataSource = new FilesDataSource(this.jobsService, this.paginator, this.sort);

        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.jobsService.onSearchClientTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    }

    validateForm()
    {
        var form = this.clientFormGroup.getRawValue();
        
        if (form.id == 0)
        {
            if (form.clientName.length > 0 && this.clientFormGroup.dirty)
                this.isSavable = true;
            else
                this.isSavable = false;
        }
        else if (form.id > 0)
        {
            if (form.clientName.length > 0 && this.clientFormGroup.dirty)
                this.isSavable = true;
            else
                this.isSavable = false;
        }
    }

    clearForm() {
        this.clientFormGroup.patchValue(
        {
            id: 0,
            clientName: '',
            shortName: ''
        });

        this.clientForm = new Client({});
        this.isSavable = false;
    }

    getClientList() {
        this.clients = [];
        this.jobsService.getClients().then(response => {
            if (response) {
                response.map(client => {
                    this.clients.push({ "id": client["id"], "clientname": client["clientname"] })
                });
            }
        });
    }

    selectedClient(client: Client) {
        this.clientFormGroup.patchValue(
            {
                id: client.id,
                clientName: client.clientname,
                shortName: client.shortname
            });

        this.isFormExpanded = true;
    }

    saveClient()
    {
        this.clientForm = this.clientFormGroup.getRawValue();
        this.progressbar.showProgress();

        this.jobsService.saveClient(this.clientForm).then(response => {
            if (response)
            {
                this.clearForm();
                this.progressbar.hideProgress();
                this.snackComp.showUnfinishedSnackBar(response["Message"]);
            }
        });
    }

    deleteClient(client: Client)
    {
        this.confirmDialogRef = this.confirmDialog.open(FuseConfirmDialogComponent, {
             disableClose: false
         });

        this.confirmDialogRef.componentInstance.title = this.utilities.clientDeleteConfirmTitle;
        this.confirmDialogRef.componentInstance.confirmMessage = this.utilities.clientDeleteConfirmMessage;
        
        this.confirmDialogRef.afterClosed().subscribe(result =>
        {
             if (result)
             {
                 this.progressbar.showProgress();
                 this.jobsService.deleteJobClient(client).then(response => {
                    if (response) {
                        this.clearForm();
                        this.progressbar.hideProgress();
                        this.snackComp.showUnfinishedSnackBar(response["Message"]);
                    }
                });
             }
             this.confirmDialogRef = null;
         });
    }


    private createClientForm() {
        return this.formBuilder.group({
            id: [this.clientForm.id],
            clientName: [this.clientForm.clientname],
            shortName: [this.clientForm.shortname]
        });
    }

}

export class FilesDataSource extends DataSource<any>
{
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    _filterChange = new BehaviorSubject('');
    _filteredDataChange = new BehaviorSubject('');

    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }
    constructor(private jobsService: JobsService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.jobsService.clients;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this.jobsService.onClientChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        
        return Observable.merge(...displayDataChanges).map(() => {
            let data = this.jobsService.clients.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

             if ( this.directiveScroll )
            {
                this.directiveScroll.scrollToTop(0, 500);
                this.directiveScroll.update();
                
            }

            // Grab the page's slice of data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
    }

    filterData(data)
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[]
    {
        if ( !this._sort.active || this._sort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {             
                case 'jn_clientname':
                    [propertyA, propertyB] = [a.clientname, b.clientname];
                    break;
                case 'jn_shortcode':
                    [propertyA, propertyB] = [a.shortcode, b.shortcode];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect()
    {
    }
}
