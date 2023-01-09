import {Trip} from "./Trip";

export enum TripStatus {
    Past = "archiwalna",
    Present = "aktywna",
    Future = "nadchodząca"
}

export class TripDetails {
    constructor(
        public trip: Trip,
        public amount: number
    ) {}

    public getTripStatus() {
        const date = new Date()

        if (this.trip.startDate <= date && date <= this.trip.endDate) {
            return TripStatus.Present
        } else if (this.trip.endDate < date) {
            return TripStatus.Past
        } else {
            return TripStatus.Future
        }
    }
}
