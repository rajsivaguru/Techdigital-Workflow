import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification.component';
import { NotificationMainSidenavComponent } from './sidenavs/main/main-sidenav.component';
import { NotificationListItemComponent } from './notification-list/notification-list-item/notification-list-item.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NotificationService } from './notification.service';
import { NotificationComposeFormComponent } from './dialogs/compose/compose.component';

const routes: Routes = [
    {
        path        : 'notification',
        //loadChildren: './main/content/notification/notification.module'
        component: NotificationComponent,
        resolve  : {
            mail: NotificationService
        }
    }
    // ,
    // {
    //     path     : 'label/:labelHandle',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // },
    // {
    //     path     : 'label/:labelHandle/:mailId',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // },
    // {
    //     path     : 'filter/:filterHandle',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // },
    // {
    //     path     : 'filter/:filterHandle/:mailId',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // },
    // {
    //     path     : ':folderHandle',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // },
    // {
    //     path     : ':folderHandle/:mailId',
    //     component: NotificationComponent,
    //     resolve  : {
    //         mail: NotificationService
    //     }
    // }
    // ,
    // {
    //     path      : '**',
    //     redirectTo: 'inbox'
    // }
];

@NgModule({
    declarations   : [
        NotificationComponent,
        NotificationListComponent,
        NotificationListItemComponent,
        NotificationDetailsComponent,
        NotificationMainSidenavComponent,
        NotificationComposeFormComponent
    ],
    imports        : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers      : [
        NotificationService
    ],
    entryComponents: [NotificationComposeFormComponent]
})
export class NotificationModule
{
}
