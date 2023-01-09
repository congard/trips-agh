export class NotificationManager {
    private notifications: Notification[] = []
    private nextId = 0

    public add(notification: Notification) {
        notification.id = this.nextId++
        this.notifications.push(notification)
    }

    public remove(notification: Notification) {
        const index = this.notifications.indexOf(notification, 0);

        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }

    public get() {
        return this.notifications
    }

    public count() {
        return this.notifications.length
    }
}

export class Notification {
    public id: number = -1

    constructor(
        public title: string,
        public description: string
    ) {}
}
