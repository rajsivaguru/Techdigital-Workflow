import { DatePipe } from '@angular/common';

export class Status
{
    statusid: number;
    name: string;
    description: string;
    sortorder: number;
    disabled: boolean;

    constructor(status?)
    {
        this.statusid = status.statusid || 0;
        this.name = status.name || '';
        this.description = status.description || '';
        this.sortorder = status.sortorder || 0;
        this.disabled = status.disabled || false;
    }
}

export class CustomerVendor {
    customervendorid: number;
    name: string;
    type: string;

    constructor(customer?) {
        this.customervendorid = customer.customervendorid || 0;
        this.name = customer.name || '';
        this.type = customer.type || '';
    }
}

