import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolsService {

  // Observable string sources
  // config
  private toolsSource = new Subject<boolean>();
  private datepickerSource = new Subject<boolean>();

  // Observable string streams
  // config
  tools$ = this.toolsSource.asObservable();
  datepicker$ = this.datepickerSource.asObservable();

  // Service message commands
  // config
  showTools(show: boolean) {
    this.toolsSource.next(show);
  }
  showDatePicker(show: boolean) {
    this.datepickerSource.next(show);
  }
}
