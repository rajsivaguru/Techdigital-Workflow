import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { SnackBarService } from '../../dialog/snackbar.service'
import { Consultant, CustomerVendor, InvoiceSupportingDetail } from '../accounts.model';
import { AccountsService } from '../accounts.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'consultants',
    templateUrl: './consultants.component.html',
    styleUrls: ['../accounts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ConsultantsComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    
    progressbar: ProgressBarConfig;
    matTableInner: number;
    searchInput: FormControl;
    dataSource: FilesDataSource | null;
    /* ic = InvoiceConsultant */
    displayedColumns = ['ic_name', 'ic_customer', 'ic_endclient', 'ic_startdate', 'ic_invoicestartdate', 'ic_enddate', 'ic_billingfrequency'];
    emailValidator = new FormControl('', [Validators.required, Validators.email]);
    emailInvoiceValidator = new FormControl('', [Validators.required, Validators.email]);
    
    consultant: Consultant;
    supportingDetail: InvoiceSupportingDetail;
    customers: CustomerVendor[];
    endclients: CustomerVendor[];
    vendors: CustomerVendor[];
    showDetail: boolean = false;
    isNew: boolean = false;
    showInvoiceEmail: boolean = false;
    showInvoicePortal: boolean = false;
    showBillTo: boolean = false;
    hasEnded: boolean = false;
    isModelValid: boolean = false;
    oldEndDate: Date;
    minEndDate: Date;

    constructor(
        private accountsService: AccountsService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.accountsService, this.paginator, this.sort);

        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.accountsService.onSearchConsultantsTextChanged.next(searchText);
            });

        if (this.accountsService.consultants == undefined || this.accountsService.consultants.length == 0 || this.accountsService.supportingDetail == undefined)
            this.refresh();
        else
            this.supportingDetail = this.accountsService.supportingDetail;
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    refresh() {
        this._getInvoiceSupportingDetails();
        //this._getConsultants();
    }

    /* show add form */
    showAddConsultantForm()
    {
        this.isNew = true;
        this.showDetail = true;
        this.showInvoiceEmail = false;
        this.showInvoicePortal = false;
        this.isModelValid = true;
        this.consultant = new Consultant({});
        this.emailValidator = new FormControl(this.consultant.email, [Validators.required, Validators.email]);
        this.emailInvoiceValidator = new FormControl(this.consultant.invoiceemail, [Validators.required, Validators.email]);
    }

    getEmailErrorMessage(email) {
        if (email == this.utilities.ict_portal)
            return this.emailInvoiceValidator.hasError('required') ? this.utilities.emailRequired : this.emailInvoiceValidator.hasError('email') ? this.utilities.emailInvalid : '';
        else
            return this.emailValidator.hasError('required') ? this.utilities.emailRequired : this.emailValidator.hasError('email') ? this.utilities.emailInvalid : '';
    }

    isNumber(e)
    {
        var charcode = (e.which) ? e.which : e.keycode;
        if (!(charcode >= 48 && charcode <= 57)) {
            return false;
        }
        return true;
    }

    onEmploymentTypeChange(etype) {
        this._getEmploymentTypeById(etype.value);
    }

    onCommunicationChange(communication)
    {
        this._filterCommunication(communication);
    }

    /* show edit form */
    editConsultant(consultant)
    {
        this.isNew = false;
        this.showDetail = true;
        this.isModelValid = true;
        this.consultant = consultant;

        if (consultant.enddate != null && consultant.enddate != undefined)
            this.hasEnded = true;
        else
            this.hasEnded = false;

        this.oldEndDate = this.consultant.enddate;
        this.minEndDate = this.consultant.invoicestartdate;

        this._filterCommunication(this.consultant.communicationid);
        /* Uncomment if it has to toggle visibility based on Employment Type in Detail form. */
        this._getEmploymentTypeById(this.consultant.employmenttypeid);
    }

    addConsultant()
    {
        this.consultant.email = this.emailValidator.value;
        this.consultant.invoiceemail = this.emailInvoiceValidator.value;

        if (!this.validate(this.consultant))
            this.isModelValid = false;
        else
        {
            this.isModelValid = true;

            this.progressbar.showProgress();
            this.accountsService.saveConsultant(this.consultant).then(response => {
                this.progressbar.hideProgress();

                if (response["ResultStatus"] == "1")
                {
                    this.showDetail = false;
                    this._getConsultants();
                }
                this.snackComp.showSnackBarPost(response, '');
            });
        }
    }

    endClient()
    {
        if (!this.validate(this.consultant))
            this.isModelValid = false;
        else {
            this.isModelValid = true;

            this.progressbar.showProgress();
            this.accountsService.saveConsultant(this.consultant).then(response => {
                this.progressbar.hideProgress();

                if (response["ResultStatus"] == "1") {
                    this.showDetail = false;
                    this.snackComp.showSnackBarPost(response, '');
                }
            });
        }
    }

    cancel()
    {
        if (!this.isNew)
        {
            this.consultant.enddate = this.oldEndDate;
        }
        this.showDetail = false;
    }

    validate(user)
    {
        if (this.isNew)
        {
            if (this.emailValidator.valid)
            {
                if ((this.showInvoiceEmail && this.emailInvoiceValidator.valid) || (this.showInvoicePortal && user.portalurl.trim().length > 0) || (user.communicationid > 0 && !this.showInvoiceEmail && !this.showInvoicePortal)
                    && /\d{10}/.test(user.phone))
                {
                    if (user.payrate == null || user.payrate == undefined)
                        user.payrate = '';

                    if (user.firstname.trim().length > 0 && user.lastname.trim().length > 0 && user.phone.trim().length == 10 && user.customer.trim().length > 2 && user.employmenttypeid > 0
                        && user.billingfrequencyid > 0 && user.startdate.toString().trim().length > 0 && user.invoicestartdate.toString().trim().length > 0 && user.invoicestartdate >= user.startdate
                        && !isNaN(user.billrate) && !isNaN(user.payrate) && user.payrate <= user.billrate && (!this.showBillTo || (this.showBillTo && user.payrate >= 0))
                        && ((user.commissionrate.toString().trim().length > 0 && !isNaN(user.commissionrate) && user.commissionto.toString().trim().length > 0) || (user.commissionrate.toString().trim().length == 0 && user.commissionto.trim().length == 0))
                        && (!this.showBillTo || this.showBillTo && user.billpayto.trim().length > 0)
                    )
                    {
                        if (user.payrate == '')
                            user.payrate = 0;

                        return true;
                    }                        
                }
            }
        }
        else
        {
            if (user.enddate.toString().trim().length > 0 && user.enddate >= new Date(user.invoicestartdate))
                return true;
        }

        return false;
    }

    private _getInvoiceSupportingDetails() {
        this.progressbar.showProgress();
        this.accountsService.getInvoiceSupportingDetails().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                if (response['ResultStatus'] == 1)
                {
                    this.supportingDetail = this.accountsService.supportingDetail;
                    this.customers = this._getCustomers();
                    this.endclients = this._getEndClients();
                    this.vendors = this._getVendors();
                    this._getConsultants();
                }
                else
                    this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _getConsultants() {
        this.progressbar.showProgress();
        this.accountsService.getConsultants().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _getEmploymentTypeById(id) {
        this.showBillTo = false;
        this.supportingDetail.employmenttypes.filter((x) => {
            if (x.employmenttypeid == id) {
                if (x.code == this.utilities.iet_1099 || x.code == this.utilities.iet_c2c)
                    this.showBillTo = true;
            }
        });
    }

    private _getCustomers() {
        let _customers = [];
        this.supportingDetail.customervendors.filter((x) => {
            if (x.type == this.utilities.icv_customer) {
                _customers.push(x);
            }
        });
        return _customers;
    }

    private _getEndClients() {
        let _endclients = [];
        this.supportingDetail.customervendors.filter((x) => {
            if (x.type == this.utilities.icv_endclient) {
                _endclients.push(x);
            }
        });
        return _endclients;
    }

    private _getVendors() {
        let _vendors = [];
        this.supportingDetail.customervendors.filter((x) => {
            if (x.type == this.utilities.icv_vendor || x.type == this.utilities.icv_consultant) {
                _vendors.push(x);
            }
        });
        return _vendors;
    }

    private _filterCommunication(communication)
    {
        let id = this.isNew ? communication.value : communication;

        this.supportingDetail.communicationmodes.filter((x) => {
            if (x.communicationid == id) {
                this.showInvoiceEmail = false;
                this.showInvoicePortal = false;

                if (x.mode == this.utilities.ict_email)
                    this.showInvoiceEmail = true;
                else if (x.mode == this.utilities.ict_portal)
                    this.showInvoicePortal = true;
            }
        });
    }

}

export class FilesDataSource extends DataSource<any>
{
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    _filterChange = new BehaviorSubject('');
    _filteredDataChange = new BehaviorSubject('');

    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    constructor(private accountsService: AccountsService, private _paginator: MatPaginator, private _sort: MatSort) {
        super();
        if (this.accountsService.consultants != undefined)
            this.filteredData = this.accountsService.consultants;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        var displayDataChanges = [];

        if (this._paginator != undefined)
            displayDataChanges = [
                this.accountsService.onConsultantsChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.accountsService.onConsultantsChanged,
                this._filterChange
            ];

        return Observable.merge(...displayDataChanges).map(() => {
            if (this.accountsService.consultants != undefined) {
                let data = this.accountsService.consultants.slice();

                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);

                if (this.directiveScroll) {
                    this.directiveScroll.scrollToTop(0, 500);
                    this.directiveScroll.update();
                }

                var pageindex = this._paginator != undefined ? this._paginator.pageIndex : 1;
                var pagesize = this._paginator != undefined ? this._paginator.pageSize : 25;
                const startIndex = pageindex * pagesize;
                return data.splice(startIndex, pagesize);
            }
        });
    }

    filterData(data) {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[] {
        if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';
            //displayedColumns = ['ic_name', 'ic_customer', 'ic_endclient', 'ic_startdate', 'ic_invoicestartdate', 'ic_enddate', 'ic_billingfrequency'];
            switch (this._sort.active) {
                case 'ic_name':
                    [propertyA, propertyB] = [a.fullname, b.fullname];
                    break;
                case 'ic_customer':
                    [propertyA, propertyB] = [a.customer, b.customer];
                    break;
                case 'ic_endclient':
                    [propertyA, propertyB] = [a.endclient, b.endclient];
                    break;
                case 'ic_startdate':
                    [propertyA, propertyB] = [a.startdate, b.startdate];
                    break;
                case 'ic_invoicestartdate':
                    [propertyA, propertyB] = [a.invoicestartdate, b.invoicestartdate];
                    break;
                case 'ic_enddate':
                    [propertyA, propertyB] = [a.enddate, b.enddate];
                    break;
                case 'ic_billingfrequency':
                    [propertyA, propertyB] = [a.frequency, b.frequency];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect() {
    }
}
