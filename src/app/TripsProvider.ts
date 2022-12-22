import {Trip} from "./Trip";
import Trips from "../assets/trips.json";

export class TripsProvider {
    private trips: Trip[] = []

    constructor() {
        for (const trip of Trips) {
            this.trips.push(new Trip(
                trip.id,
                trip.name,
                trip.country,
                new Date(trip.startDate),
                new Date (trip.endDate),
                trip.unitPrice,
                trip.amount,
                trip.desc,
                trip.img,
                trip.rating,
                trip.ratingCount
            ))
        }
    }

    public get() {
        return this.trips
    }

    public add(trip: Trip) {
        this.trips.push(trip)
    }

    public remove(trip: Trip) {
        const index = this.trips.indexOf(trip, 0)

        if (index > -1) {
            this.trips.splice(index, 1)
        }
    }

    public getById(id: number): Trip | null {
        for (const trip of this.trips) {
            if (trip.id == id) {
                return trip
            }
        }

        return null
    }

    public forEach(callback: (trip: Trip, index?: number) => void) {
        return this.trips.forEach(callback)
    }

    public rate(trip: Trip, starsCount: number) {
        // TODO: checks
        ++trip.ratingCount
        trip.rating += starsCount
    }
}
