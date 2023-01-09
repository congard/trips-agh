import {Account} from "./Account";
import {CartDetails} from "./CartDetails";
import {TripsProvider} from "./trip/TripsProvider";
import {TripManager} from "./trip/TripManager";
import {NotificationManager} from "./NotificationManager";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class State {
    constructor(
        private db: AngularFireDatabase
    ) {}

    public account = new Account(this)
    public tripsProvider = new TripsProvider(this.db)
    public cart = new CartDetails()
    public tripManager = new TripManager(this)
    public notificationManager = new NotificationManager()
}
