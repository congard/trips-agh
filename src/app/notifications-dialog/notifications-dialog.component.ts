import {Component} from '@angular/core';
import {State} from "../core/State";
import {NotificationManager} from "../core/NotificationManager";

@Component({
    selector: 'app-notifications-dialog',
    templateUrl: './notifications-dialog.component.html',
    styleUrls: ['./notifications-dialog.component.css']
})
export class NotificationsDialog {
    notifications: NotificationManager

    constructor(
        private state: State
    ) {
        this.notifications = state.notificationManager
    }
}
