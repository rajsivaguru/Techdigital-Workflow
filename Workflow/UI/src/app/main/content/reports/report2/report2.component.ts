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
    selector   : 'fuse-orderexists',
    templateUrl: './report2.component.html',
    styleUrls  : ['./report2.component.scss']
})
export class Report2Component implements OnInit, AfterViewInit
{

    formConfirm : FormGroup;
    constructor(private formBuilder : FormBuilder, private router : Router)
    {
        this.formConfirm = this.formBuilder.group({});
    }

    ngOnInit()
    {
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