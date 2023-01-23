import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Injectable} from "@angular/core";
import {TripsProvider} from "../trip/TripsProvider";
import {LoginService} from "../LoginService";
import {Observable, Subject} from "rxjs";
import {UserDetails} from "./UserDetails";
import {Role} from "./Role";
import {UserProvider} from "./UserProvider";
import {TripData} from "../../edit-trip-dialog/TripData";
import {TripDetails} from "../trip/TripDetails";
import {PurchasedTripDetails} from "./PurchasedTripDetails";
import {TripStatus} from "../trip/Trip";
import {Notification, NotificationManager} from "../NotificationManager";

/**
 * Represents the current user
 */
@Injectable({
    providedIn: 'root'
})
export class User {
    public details: UserDetails = new UserDetails("", Role.Guest)

    private detailsObs?: Observable<UserDetails | null>

    public readonly onChange = new Subject<void>()

    public isLoaded = false

    constructor(
        private tripsProvider: TripsProvider,
        private loginService: LoginService,
        private userProvider: UserProvider,
        private notificationManager: NotificationManager,
        private db: AngularFireDatabase
    ) {
        this.onChange.subscribe(() => {
            this.notificationManager.clear()

            // push notifications if needed
            this.forEachPurchasedTrip(tripId => {
                tripsProvider.getById(tripId).then(trip => {
                    if (trip?.getStatus() == TripStatus.Future) {
                        const formatDate = (d: Date) =>
                            `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`

                        this.notificationManager.add(new Notification(
                            "Nadchodząca wycieczka",
                            `${formatDate(trip.startDate)}-${formatDate(trip.endDate)}: ${trip.name}, ${trip.country}`
                        ))
                    }
                })
            })
        })

        loginService.onAuthStateChange.subscribe(() => {
            if (!loginService.isLoggedIn) {
                this.reset()
                return
            }

            this.initDetailsObs()
        })

        if (loginService.isLoggedIn) {
            this.initDetailsObs()
        }
    }

    private reset() {
        this.details = new UserDetails("", Role.Guest)
        this.isLoaded = false
    }

    private initDetailsObs() {
        this.detailsObs = this.db.object<UserDetails>(`/users/${this.uid!}`).valueChanges()
        this.detailsObs.subscribe(details => {
            this.details = details as UserDetails
            this.isLoaded = true
            this.onChange.next()
        })
    }

    public get role() {
        return this.details.role
    }

    public get isGuest() {
        return this.role == Role.Guest
    }

    public get isBanned() {
        return this.role == Role.Banned
    }

    public get isUser() {
        return this.role == Role.User
    }

    public get isManager() {
        return this.role == Role.Manager
    }

    public get isAdmin() {
        return this.role == Role.Admin
    }

    public get uid(): string | undefined {
        return this.loginService.user?.uid
    }

    public buyTrip(tripId: string, amount: number) {
        return new Promise<void>((resolve, reject) => {
            this.tripsProvider.getById(tripId).then(trip => {
                if (trip == null) {
                    reject("trip is null")
                    return
                }

                if (trip.amount - amount >= 0) {
                    const data = new TripData()
                    data.id = tripId
                    data.amount = trip.amount - amount

                    this.tripsProvider.update(data).then(() => {
                        this.userProvider.addPurchasedTrip(this.uid!, tripId, new Date(), amount).then(() => {
                            resolve()
                        }).catch(reason => reject(reason))
                    }).catch(reason => reject(reason))
                } else {
                    reject("You cannot buy such amount of tickets")
                }
            }).catch(reason => reject(reason))
        })
    }

    public rateTrip(tripId: string, stars: number) {
        return this.userProvider.rateTrip(this.loginService.user!.uid, tripId, stars)
    }

    public isTripRated(tripId: string) {
        return this.details.rated != undefined && Object.keys(this.details.rated).indexOf(tripId) >= 0
    }

    public forEachPurchasedTrip(pred: (tripId: string, details: PurchasedTripDetails) => void) {
        if (this.details.purchased == undefined)
            return

        Object.keys(this.details.purchased).forEach(key => {
            // @ts-ignore
            pred(key, this.details.purchased![key])
        })
    }

    public async forEachPurchasedTripAsync(pred: (tripId: string, details: PurchasedTripDetails) => Promise<void>) {
        if (this.details.purchased == undefined)
            return

        for (const key of Object.keys(this.details.purchased)) {
            // @ts-ignore
            await pred(key, this.details.purchased[key])
        }
    }

    public async getPurchasedTrips() {
        const trips: TripDetails[] = []

        await this.forEachPurchasedTripAsync(async (tripId, details) => {
            const trip = await this.tripsProvider.getById(tripId)
            trips.push(new TripDetails(trip!, details))
        })

        return trips
    }
}
