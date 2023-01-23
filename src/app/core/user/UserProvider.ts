import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {UserDetails} from "./UserDetails";
import {Role} from "./Role";
import {Subject, Subscription} from "rxjs";
import {TripsProvider} from "../trip/TripsProvider";
import {PurchasedTripDetails} from "./PurchasedTripDetails";

/**
 * Provides tools for managing users
 */
@Injectable({
    providedIn: 'root'
})
export class UserProvider {
    public users: UserDetails[] = []

    public readonly onUsersChange = new Subject<void>()

    private usersList: AngularFireList<UserDetails>

    private usersSub?: Subscription

    constructor(
        private db: AngularFireDatabase,
        private tripsProvider: TripsProvider
    ) {
        this.usersList = this.db.list<UserDetails>("/users")
    }

    public loadUsers(isLoad: boolean) {
        if (isLoad && this.usersSub == undefined) {
            this.usersSub = this.usersList.valueChanges().subscribe(users => {
                this.users = users
                this.onUsersChange.next()
            })
        } else if (!isLoad && this.usersSub != undefined) {
            this.usersSub.unsubscribe()
        }
    }

    public getUIDByEmail(email: string) {
        return new Promise<string>((resolve, reject) => {
            this.usersList.query.orderByChild("email").equalTo(email).get().then(val => {
                // get uid
                const users = val.val()
                const keys = Object.keys(users)

                if (keys.length != 1) {
                    reject(`keys.length != 1, keys.length is ${keys.length}`)
                    return
                }

                resolve(keys[0])
            })
        })
    }

    public updateUser(uid: string, data: object) {
        return this.usersList.update(uid, data)
    }

    public updateUserByEmail(email: string, data: object) {
        return new Promise<void>((resolve, reject) => {
            this.getUIDByEmail(email).then(uid => {
                this.updateUser(uid, data)
                    .then(() => resolve())
                    .catch(reason => reject(reason))
            }).catch(reason => reject(reason))
        })
    }

    public rateTrip(uid: string, tripId: string, stars: number) {
        return new Promise<void>((resolve, reject) => {
            this.tripsProvider.getById(tripId).then(trip => {
                if (trip != null) {
                    this.tripsProvider._rate(trip, stars).then(() => {
                        const update = {
                            [`/users/${uid}/rated/${tripId}`]: true
                        }
                        this.db.object("/").update(update)
                            .then(() => resolve())
                            .catch(reason => reject(reason))
                    }).catch(reason => reject(reason))
                } else {
                    reject("Trip is null")
                }
            }).catch(reason => reject(reason))
        })
    }

    public addPurchasedTrip(uid: string, tripId: string, date: Date, amount: number) {
        const update = {
            [`/users/${uid}/purchased/${tripId}`]: new PurchasedTripDetails(date.getTime(), amount)
        }
        return this.db.object("/").update(update)
    }

    public onUserRegistered(uid: string, email: string) {
        return this.db.object(`/users/${uid}`).set(new UserDetails(email, Role.User, {}, {}))
    }
}
