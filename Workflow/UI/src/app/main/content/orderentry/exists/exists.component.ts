import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import { Location } from '@angular/common';
import {OrderExists} from '../orderentry.model';
import {OrderEntryService} from '../orderentry.service';
import { DatePipe } from '@angular/common';

import {FuseOrderEntryComponent} from '../order/order.component';

@Component({
    selector   : 'fuse-orderexists',
    templateUrl: './exists.component.html',
    styleUrls  : ['./exists.component.scss']
})
export class FuseOrderExistsComponent implements OnInit, AfterViewInit
{

    order  = new OrderExists();
    formConfirm : FormGroup;
    constructor(private formBuilder : FormBuilder, private router : Router, private orderService : OrderEntryService, private orderComponent : FuseOrderEntryComponent)
    {
        this.formConfirm = this.formBuilder.group({});
    }

    ngOnInit()
    {
        if(!this.orderService.orderValidated)
            this.router.navigateByUrl('/orderentry');
            
        this.order =  this.orderService.orderDuplicateData;
    }
    ngAfterViewInit() {
    }

    goBack() {
           this.router.navigateByUrl('/orderentry');
        }
    goSubmit()
    {
       this.router.navigateByUrl('/orderconfirm');
    }

}