import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Order, OrderExists} from './orderentry.model'

@Injectable()
export class OrderEntryService {

  private orderData = new Subject<Order>();  

  public savedOrderData = new Order();
  public orderDuplicateData = new OrderExists();
  public orderValidated : Boolean

  // Observable string streams
  orderData$ = this.orderData.asObservable();

    // Service message commands
  publishData(data: Order) {
    this.orderData.next(data);
  }
  constructor() { 

    this.orderValidated = false;
  }

}
