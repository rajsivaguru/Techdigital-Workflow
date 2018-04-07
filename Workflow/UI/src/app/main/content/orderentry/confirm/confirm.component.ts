import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import { Location } from '@angular/common';
import {Order} from '../orderentry.model';
import {OrderEntryService} from '../orderentry.service';
import { DatePipe } from '@angular/common';

import {FuseOrderEntryComponent} from '../order/order.component';

@Component({
    selector   : 'fuse-orderconfirm',
    templateUrl: './confirm.component.html',
    styleUrls  : ['./confirm.component.scss']
})
export class FuseOrderConfirmComponent implements OnInit, AfterViewInit
{

    order  = new Order();
    formConfirm : FormGroup;
    constructor(private formBuilder : FormBuilder, private router : Router, private orderService : OrderEntryService, private orderComponent : FuseOrderEntryComponent)
    {

        this.formConfirm = this.formBuilder.group({});
        //console.log('confirm - constructor');
        // this.orderService.orderData$.subscribe(
        //     data => {
        //         console.log(data);
        //         this.order = data;
        //     });

    }

    ngOnInit()
    {
        //console.log('confirm - init')
        if(!this.orderService.orderValidated)
        {
            this.router.navigateByUrl('/orderentry');
            return;
        }
        this.order =  this.orderService.savedOrderData;

        

    }
    ngAfterViewInit() {
        // never raised an issue until now
    }

    goBack() {
           this.router.navigateByUrl('/orderentry');
        }
    goSubmit()
    {
        this.orderComponent.submitOrder();
    }

}