import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';


@Component({
    selector   : 'fuse-orderconfirm',
    templateUrl: './report3.component.html',
    styleUrls  : ['./report3.component.scss']
})
export class Report3Component implements OnInit, AfterViewInit
{

    formConfirm : FormGroup;
    constructor(private formBuilder : FormBuilder, private router : Router)
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

    }
    ngAfterViewInit() {
        // never raised an issue until now
    }

    goBack() {
           this.router.navigateByUrl('/orderentry');
        }
    goSubmit()
    {
    }

}