import {Component} from '@angular/core';
import {NotificationManager} from "../core/NotificationManager";

@Component({
    selector: 'app-notifications-dialog',
    templateUrl: './notifications-dialog.component.html',
    styleUrls: ['./notifications-dialog.component.css']
})
export class NotificationsDialog {
    constructor(
        public notifications: NotificationManager
    ) {}
}
