import {Trip} from "./Trip";
import {Rating} from "./Rating";
import {Comment} from "./Comment";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {firstValueFrom, Observable, Subscription} from "rxjs";
import {Injectable} from "@angular/core";
import {TripData as TData} from "../../edit-trip-dialog/TripData";

type OnDataUpdateListener = () => void

@Injectable({
    providedIn: 'root'
})
export class TripsProvider {
    private _trips: Trip[] = []

    private tripsList: AngularFireList<TripData>
    private readonly tripsRef: Observable<TripData[]>

    private subscription?: Subscription = undefined

    public onDataUpdateListeners: OnDataUpdateListener[] = []

    constructor(
        private db: AngularFireDatabase
    ) {
        this.tripsList = db.list("trips")
        this.tripsRef = this.tripsList.valueChanges()
    }

    public get trips() {
        // fetch data only if we need it all
        if (this.subscription == undefined) {
            this.subscription = this.tripsRef.subscribe(tripData => {
                this.trips = []
                tripData.forEach(trip => this.trips.push(tripData2trip(trip)))
                this.onDataUpdateListeners.forEach(listener => listener())
            })
        }

        return this._trips
    }

    public set trips(trips: Trip[]) {
        this._trips = trips
    }

    public get() {
        return this.trips.filter(trip => trip.amount > 0)
    }

    public add(trip: Trip): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const data = trip2tripData(trip)

            this.tripsList.push(data).then(value => {
                this.tripsList.update(value.key!, {id: value.key!} as any)
                    .then(() => resolve())
                    .catch(reason => reject(reason))
            }).catch(reason => reject(reason))
        })
    }

    public remove(trip: Trip) {
        return this.tripsList.remove(trip.id)
    }

    public update(tData: TData) {
        const data = {}

        const writeData = (key: string, value: any) => {
            if (value != undefined) {
                // @ts-ignore
                data[key] = value
            }
        }

        writeData("name", tData.name)
        writeData("country", tData.country)
        writeData("startDate", tData.startDate?.getTime())
        writeData("endDate", tData.endDate?.getTime())
        writeData("unitPrice", tData.unitPrice)
        writeData("amount", tData.amount)
        writeData("desc", tData.desc)
        writeData("img", tData.img)
        writeData("images", tData.images.length == 0 ? undefined : tData.images)

        return this.tripsList.update(tData.id!, data)
    }

    public getByIdCached(id: string): Trip | null {
        for (const trip of this.trips) {
            if (trip.id == id) {
                return trip
            }
        }

        return null
    }

    public async getById(id: string): Promise<Trip | null> {
        {
            const trip = this.getByIdCached(id)

            if (trip != null) {
                return trip
            }
        }

        const trip = await firstValueFrom(this.db.list<TripData>("trips",
                ref => ref.orderByChild("id").equalTo(id)).valueChanges())

        return trip.length > 0 ? tripData2trip(trip[0]) : null
    }

    public forEach(callback: (trip: Trip, index?: number) => void) {
        return this.get().forEach(callback)
    }

    /**
     * Do not use it in your code, use UserProvider#rateTrip instead
     * @param trip
     * @param starsCount
     */
    public _rate(trip: Trip, starsCount: number) {
        ++trip.rating.ratingArray[starsCount - 1]
        return this.tripsList.update(trip.id, {
            rating: trip.rating.ratingArray
        } as any)
    }

    public comment(trip: Trip, comment: Comment) {
        // Very bad design. Ale nie mogę tego już zmienić,
        // bo poprzednie zestawy przestaną działać
        trip.comments.push(comment)

        return new Promise<void>((resolve, reject) => {
            this.tripsList.update(trip.id, {
                comments: trip.comments
            }).then(() => {
                resolve()
            }).catch(reason => {
                trip.comments.splice(trip.comments.indexOf(comment), 1)
                reject(reason)
            })
        })
    }
}

class TripData {
    constructor(
        public id: string,
        public name: string,
        public country: string,
        public startDate: number,
        public endDate: number,
        public unitPrice: number,
        public amount: number,
        public desc: string,
        public img: string,
        public images: string[],
        public rating: number[],
        public comments: Comment[]
    ) {}
}

function trip2tripData(trip: Trip) {
    return new TripData(
        trip.id,
        trip.name,
        trip.country,
        trip.startDate.getTime(),
        trip.endDate.getTime(),
        trip.unitPrice,
        trip.amount,
        trip.desc,
        trip.img,
        trip.images,
        trip.rating.ratingArray,
        trip.comments
    )
}

function tripData2trip(trip: TripData) {
    return new Trip(
        trip.id,
        trip.name,
        trip.country,
        new Date(trip.startDate),
        new Date (trip.endDate),
        trip.unitPrice,
        trip.amount,
        trip.desc,
        trip.img,
        trip.images,
        new Rating(trip.rating),
        trip.comments
    )
}
