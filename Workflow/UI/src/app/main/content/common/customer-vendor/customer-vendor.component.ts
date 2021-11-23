import { Component,Inject,  OnDestroy, OnInit, ElementRef,TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
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
import { CustomerVendor } from '../common.model';
import { CommonService } from '../common.service';
import { DialogComponent, DialogDataComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'customer-vendor',
    templateUrl  : './customer-vendor.component.html',
    styleUrls    : ['../common.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class CustomerVendorComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    customervendors: CustomerVendor[];
    customervendor: CustomerVendor;
    customerTypes: any[];
    dataSource: FilesDataSource | null;
    displayedColumns = ['cv_name', 'cv_type', 'cv_buttons'];
    progressbar: ProgressBarConfig;
    searchInput: FormControl;
    isFormExpanded: boolean = true;
    isSavable: boolean = false;
    
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    matTableInner: number;

    constructor(
        private confirmDialog: MatDialog,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl('');
        this.customervendor = new CustomerVendor({});
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.commonService, this.paginator, this.sort);

        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(searchText => {
                this.paginator.pageIndex = 0;
                this.commonService.onSearchCustomerVendorTextChanged.next(searchText);
            });

        if (this.commonService.customersvendors == undefined || this.commonService.customersvendors.length == 0 || this.commonService.customerTypes == undefined || this.commonService.customerTypes.length == 0)
            this.refresh();
        else
        {
            this.customerTypes = this.commonService.customerTypes;
            this.customervendors = this.commonService.customersvendors;
        }
    }

    ngOnDestroy() {
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    }
    
    refresh() {
        this._getCustomerTypes();
        this._getCustomerVendorList();
    }

    validateForm()
    {
        this.isSavable = false;
        let _item = this.customervendor;

        if (_item.name.length > 0 && _item.type.length > 0) {
            if (!this._isDuplicate()) {
                this.isSavable = true;
                return true;
            }
        }

        return false;
    }

    clearForm()
    {        
        this.isSavable = false;

        if (this.customervendor.customervendorid > 0)
            this._getCustomerVendorList();

        this.customervendor = new CustomerVendor({});
    }

    selectedItem(customervendor: CustomerVendor) {
        this.customervendor = customervendor;
        this.isFormExpanded = true;
        this.validateForm();
    }

    save()
    {
        if (this.validateForm())
        {
            this.progressbar.showProgress();

            this.commonService.saveCustomer(this.customervendor).then(response => {
                if (response) {
                    this.progressbar.hideProgress();
                    this.clearForm();
                    this.snackComp.showSnackBarPost(response, '');
                    this._getCustomerVendorList();
                }
            });
        }
    }

    deleteItem(customervendor: CustomerVendor)
    {
        this.confirmDialogRef = this.confirmDialog.open(FuseConfirmDialogComponent, {
             disableClose: false
         });

        this.confirmDialogRef.componentInstance.title = this.utilities.customerVendorDeleteConfirmTitle;
        this.confirmDialogRef.componentInstance.confirmMessage = this.utilities.customerVendorDeleteConfirmMessage;
        
        this.confirmDialogRef.afterClosed().subscribe(result =>
        {
             if (result)
             {
                 this.progressbar.showProgress();
                 this.commonService.deleteCustomer(customervendor.customervendorid).then(response => {
                     if (response) {
                         this.progressbar.hideProgress();
                         this.clearForm();
                         this.snackComp.showSnackBarPost(response, '');
                         this._getCustomerVendorList();
                    }
                });
             }
             this.confirmDialogRef = null;
         });
    }

    private _getCustomerVendorList() {
        this.progressbar.showProgress();
        this.commonService.getCustomersVendors().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.customervendors = this.commonService.customersvendors;                
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _getCustomerTypes() {
        this.progressbar.showProgress();
        this.commonService.getCustomerTypes().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.customerTypes = this.commonService.customerTypes;
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }

    private _isDuplicate()
    {
        var items = this.customervendors.filter(x => x.name.toLocaleLowerCase() == this.customervendor.name.trim().toLocaleLowerCase() && x.type == this.customervendor.type);

        if (items == null || items == undefined || items.length == 0 || (items.length <= 1 && this.customervendor.customervendorid > 0))
            return false;
        else
            return true;
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

    constructor(private commonService: CommonService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        this.filteredData = this.commonService.customersvendors;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this.commonService.onCustomerVendorChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        
        return Observable.merge(...displayDataChanges).map(() => {
            let data = this.commonService.customersvendors.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

             if ( this.directiveScroll )
            {
                this.directiveScroll.scrollToTop(0, 500);
                this.directiveScroll.update(); 
            }

             //Grab the page's slice of data.
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
                case 'cv_name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'cv_type':
                    [propertyA, propertyB] = [a.type, b.type];
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
