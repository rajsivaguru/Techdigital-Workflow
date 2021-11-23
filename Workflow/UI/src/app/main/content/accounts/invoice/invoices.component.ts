import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
import { CommonService } from '../../common/common.service';
import { Status } from '../../common/common.model';
import { Invoice } from '../accounts.model';
import { AccountsService } from '../accounts.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'invoices',
    templateUrl: './invoices.component.html',
    styleUrls: ['../accounts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InvoicesComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    progressbar: ProgressBarConfig;
    matTableInner: number;
    searchInput: FormControl;
    dataSource: FilesDataSource | null;
    /* ii = Invoices */
    displayedColumns = ['ii_id', 'ii_name', 'ii_customer', 'ii_endclient', 'ii_invoicestartdate', 'ii_invoiceenddate', 'ii_tsexpectedhours', 'ii_tsactualhours', 'ii_status', 'ii_percent'];

    invoice: Invoice;
    statuses: Status[];
    showDetail: boolean = false;
    showPaymentHistory: boolean = false;
    isTSControlsEnabled: boolean = false;
    isICreatedControlsEnabled: boolean = false;
    isISentControlsEnabled: boolean = false;
    isPaymentControlsEnabled: boolean = false;
    isBillPaidControlsEnabled: boolean = false;
    isCommissionPaidControlsEnabled: boolean = false;

    shouldsendinvoice: boolean = false;
    hasCommission: boolean = false;
    isW2: boolean = false;
    isModelValid: boolean = false;
    currentDate: Date;
    oldStatusSortOrder: number;
    step = 0;
    
    constructor(
        private accountsService: AccountsService,
        private snackComp: SnackBarService,
        private utilities: Utilities,
        private commonService: CommonService
    ) {
        this.searchInput = new FormControl('');
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.accountsService, this.paginator, this.sort);
        
        this.currentDate = new Date();

        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.accountsService.onSearchInvoicesTextChanged.next(searchText);
            });
        
        if (this.accountsService.invoices == undefined || this.accountsService.invoices.length == 0)
            this.refresh();
        if (this.commonService.statuses == undefined || this.commonService.statuses.length == 0)
            this._getInvoiceStatus();
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    refresh() {
        this._getActiveInvoices();
    }

    /* Show edit form */
    editInvoice(invoice)
    {
        this.showPaymentHistory = false;
        this.isModelValid = true;
        this.oldStatusSortOrder = invoice.statussortorder;
        this.step = 0;
        this.invoice = invoice;
        this.isW2 = this.invoice.isw2;
        this.shouldsendinvoice = this.invoice.shouldsendinvoice;
        this.hasCommission = this.invoice.hascommission;
        this._getInvoiceDetails(invoice.invoiceid);
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }
    
    saveInvoice(no: number)
    {
        if (!this._validate(this.invoice, no))
            this.isModelValid = false;
        else
        {
            this.isModelValid = true;

            this.progressbar.showProgress();
            this.accountsService.saveInvoice(this.invoice).then(response => {
                this.progressbar.hideProgress();

                if (response["ResultStatus"] == "1") {
                    ////this.showDetail = false;
                    this._getActiveInvoices();
                }
                else
                {
                    if (no == 7)
                        this.invoice.status = '';
                }
                this.snackComp.showSnackBarPost(response, '');
            });
        }
    }

    cancel() {
        this.showDetail = false;
    }

    private _validate(invoice: Invoice, no: number)
    {
        switch (no)
        {
            /* Timesheet Received/Verified */
            case 1:
                if (invoice.tsreceiveddate != null && invoice.tsreceiveddate.toString().trim().length > 0 && invoice.tsreceiveddate <= new Date() && !isNaN(invoice.tsactualhours) && invoice.tsactualhours > 0)
                {
                    this._updateCurrentInvoiceStatus('Timesheet Received/Verified');
                    return true;
                }
                break;
            /* Invoice Created */
            case 2:
                if (invoice.invoicecreateddate != null && invoice.invoicecreateddate.toString().trim().length > 0 && invoice.invoicecreateddate <= new Date() && invoice.invoicenumber.trim().length > 0 && !isNaN(invoice.invoiceamount) && invoice.invoiceamount > 0)
                {
                    this._updateCurrentInvoiceStatus('Invoice Created');
                    return true;
                }
                break;
            /* Invoice Sent */
            case 3:
                if (invoice.invoicesentdate != null && invoice.invoicesentdate.toString().trim().length > 0 && invoice.invoicesentdate <= new Date())
                {
                    this._updateCurrentInvoiceStatus('Invoice Sent');
                    return true;
                }
                break;
            /* Partial Payment Received, Payment Received */
            case 4:
                if (invoice.paymentreceiveddate != null && invoice.paymentreceiveddate.toString().trim().length > 0 && invoice.paymentreceiveddate <= new Date() && !isNaN(invoice.paymentamount) && invoice.paymentamount > 0)
                {
                    if (invoice.ispartialpayment)
                        this._updateCurrentInvoiceStatus('Partial Payment Received');
                    else
                        this._updateCurrentInvoiceStatus('Payment Received');
                    return true;
                }
                break;
            /* Bill Paid */
            case 5:
                if (invoice.billpaiddate != null && invoice.billpaiddate.toString().trim().length > 0 && invoice.billpaiddate <= new Date() && !isNaN(invoice.billamount) && invoice.billamount > 0 && !isNaN(invoice.billhours) && invoice.billhours > 0)
                {
                    this._updateCurrentInvoiceStatus('Bill Paid');
                    return true;
                }
                break;
            /* Commission Paid */
            case 6:
                if (invoice.commissionpaiddate != null && invoice.commissionpaiddate.toString().trim().length > 0 && invoice.commissionpaiddate <= new Date() && !isNaN(invoice.commissionamount) && invoice.commissionamount > 0 && !isNaN(invoice.commissionhours) && invoice.commissionhours > 0)
                {
                    this._updateCurrentInvoiceStatus('Commission Paid');
                    return true;
                }
                break;
            /* Complete Invoice */
            case 7:
                this._updateCurrentInvoiceStatus('Complete Invoice');
                return true;
        }
        return false;
    }

    private _getActiveInvoices() {
        this.progressbar.showProgress();
        this.accountsService.getActiveInvoices().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _getInvoiceStatus() {
        this.progressbar.showProgress();
        this.commonService.getStatuses('Invoice').then(response => {
            this.progressbar.hideProgress();
            if (response)
            {
                if (response['ResultStatus'] == 1)
                    this.statuses = this.commonService.statuses;                    

                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _getInvoiceDetails(invoiceid) {
        this.progressbar.showProgress();
        this.accountsService.getInvoiceDetails(invoiceid).then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.invoice = response;
                this.showDetail = true;
                this._showHideControls(this.invoice);
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _showHideControls(invoice) {
        let _isValidStatus = false;
        let statusid = invoice.value == undefined ? invoice.statusid : invoice.value;

        this.isTSControlsEnabled = false;
        this.isICreatedControlsEnabled = false;
        this.isISentControlsEnabled = false;
        this.isPaymentControlsEnabled = false;
        this.isBillPaidControlsEnabled = false;
        this.isCommissionPaidControlsEnabled = false;
        
        let _activeStatus = this._getStatusById(statusid);

        switch (_activeStatus.name.toLowerCase())
        {
            case '':
                break;
            case this.utilities.is_atimesheet.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = true;
                    break;
                }
            case this.utilities.is_rvtimesheet.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;

                    if (invoice.invoicecreateddate == null)
                        this.isICreatedControlsEnabled = true;

                    if (!this.shouldsendinvoice)
                        this.isISentControlsEnabled = true;

                    break;
                }
            case this.utilities.is_icreated.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;
                    this.isICreatedControlsEnabled = false;

                    if (invoice.invoicesentdate == null && this.shouldsendinvoice)
                        this.isISentControlsEnabled = true;
                    else
                    {
                        this.isPaymentControlsEnabled = true;
                        this.isBillPaidControlsEnabled = true;

                        if (invoice.commissionpaiddate == null && this.hasCommission)
                            this.isCommissionPaidControlsEnabled = true;
                    }

                    break;
                }
            case this.utilities.is_isent.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;
                    this.isICreatedControlsEnabled = false;
                    this.isISentControlsEnabled = false;
                    
                    if (invoice.paymentreceiveddate == null || invoice.ispartialpayment)
                        this.isPaymentControlsEnabled = true;

                    this.isBillPaidControlsEnabled = true;

                    if (invoice.commissionpaiddate == null && invoice.hascommission)
                        this.isCommissionPaidControlsEnabled = true;

                    break;
                }
            default:
                {
                    if (invoice.paymentreceiveddate == null || invoice.ispartialpayment)
                        this.isPaymentControlsEnabled = true;
                    if (invoice.billpaiddate == null)
                        this.isBillPaidControlsEnabled = true;
                    if (invoice.commissionpaiddate == null && this.hasCommission)
                        this.isCommissionPaidControlsEnabled = true;
                }
        }
    }

    private _getStatusById(id) {
        if (this.statuses == undefined || this.statuses.length == 0)
            this.statuses = this.commonService.statuses;

        let _activeStatus = this.statuses.filter(x => x.statusid == id);

        if (_activeStatus != null && _activeStatus != undefined && _activeStatus.length > 0)
            return _activeStatus[0];
        else
            return new Status({});
    }

    private _getStatusByName(status)
    {
        if (this.statuses == undefined || this.statuses.length == 0)
            this.statuses = this.commonService.statuses;

        let _activeStatus = this.statuses.filter(x => x.name == status);

        if (_activeStatus != null && _activeStatus != undefined && _activeStatus.length > 0)
            return _activeStatus[0];
        else
            return new Status({});
    }

    private _isW2(employmenttypeid) {
        this.isW2 = false;
        let _types = this.accountsService.supportingDetail.employmenttypes.filter(x => x.employmenttypeid == employmenttypeid);
        
        if (_types != null && _types != undefined && _types.length > 0)
        {
            this.isW2 = true;
            return _types[0];
        }            
        else
            return [];
    }

    private _updateCurrentInvoiceStatus(status: string)
    {
        let _status = this._getStatusByName(status);
        if (_status.statusid > 0)
        {
            this.invoice.status = _status.name;
            this.invoice.statusid = _status.statusid;
        } 
    }
    
    onStatusChange(invoice) {
        //this._showHideControls(invoice);
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
        if (this.accountsService.invoices != undefined)
            this.filteredData = this.accountsService.invoices;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        var displayDataChanges = [];

        if (this._paginator != undefined)
            displayDataChanges = [
                this.accountsService.onInvoicesChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.accountsService.onInvoicesChanged,
                this._filterChange
            ];

        return Observable.merge(...displayDataChanges).map(() => {
            if (this.accountsService.invoices != undefined) {
                let data = this.accountsService.invoices.slice();

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

            switch (this._sort.active) {
                case 'ii_name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'ii_customer':
                    [propertyA, propertyB] = [a.customer, b.customer];
                    break;
                case 'ii_endclient':
                    [propertyA, propertyB] = [a.endclient, b.endclient];
                    break;
                case 'ii_invoicestartdate':
                    [propertyA, propertyB] = [a.invoicestartdate, b.invoicestartdate];
                    break;
                case 'ii_invoiceenddate':
                    [propertyA, propertyB] = [a.invoiceenddate, b.invoiceenddate];
                    break;
                case 'ii_tsexpectedhours':
                    [propertyA, propertyB] = [a.tsexpectedhours, b.tsexpectedhours];
                    break;
                case 'ii_tsactualhours':
                    [propertyA, propertyB] = [a.tsactualhours, b.tsactualhours];
                    break;
                case 'ii_status':
                    [propertyA, propertyB] = [a.status, b.status];
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
