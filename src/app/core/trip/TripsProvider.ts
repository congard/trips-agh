import {Trip} from "./Trip";
import {Rating} from "./Rating";
import {Comment} from "./Comment";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {firstValueFrom, Observable, Subscription} from "rxjs";

type OnDataUpdateListener = () => void

export class TripsProvider {
    private trips: Trip[] = []

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

    public get() {
        // fetch data only if we need it all
        if (this.subscription == undefined) {
            this.subscription = this.tripsRef.subscribe(tripData => {
                this.trips = []
                tripData.forEach(trip => this.trips.push(tripData2trip(trip)))
                this.onDataUpdateListeners.forEach(listener => listener())
            })
        }

        return this.trips.filter(trip => trip.amount > 0)
    }

    public add(trip: Trip) {
        const data = trip2tripData(trip)

        this.tripsList.push(data).then(value => {
            this.tripsList.update(value.key!, {id: value.key!} as any)
        })
    }

    public remove(trip: Trip) {
        this.tripsList.remove(trip.id)
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

    public rate(trip: Trip, starsCount: number) {
        // TODO: checks
        ++trip.rating.ratingArray[starsCount - 1]

        this.tripsList.update(trip.id, {
            rating: trip.rating.ratingArray
        } as any)
    }

    public comment(trip: Trip, comment: Comment) {
        trip.comments.push(comment)

        this.tripsList.update(trip.id, {
            comments: trip.comments
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
