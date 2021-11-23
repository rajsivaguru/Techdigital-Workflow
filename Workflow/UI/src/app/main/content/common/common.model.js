"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status = /** @class */ (function () {
    function Status(status) {
        this.statusid = status.statusid || 0;
        this.name = status.name || '';
        this.description = status.description || '';
        this.sortorder = status.sortorder || 0;
        this.disabled = status.disabled || false;
    }
    return Status;
}());
exports.Status = Status;
var CustomerVendor = /** @class */ (function () {
    function CustomerVendor(customer) {
        this.customervendorid = customer.customervendorid || 0;
        this.name = customer.name || '';
        this.type = customer.type || '';
    }
    return CustomerVendor;
}());
exports.CustomerVendor = CustomerVendor;
