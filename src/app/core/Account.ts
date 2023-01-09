import {TripsProvider} from "./trip/TripsProvider";
import {TripDetails} from "./trip/TripDetails";
import {State} from "./State";

export class Account {
    public tripHistory: TripDetails[] = []

    constructor(
        private state: State
    ) {}

    public async buyTrip(tripId: string, amount: number) {
        const trips = this.state.tripsProvider
        const trip = await trips.getById(tripId)
        trip!.amount -= amount
        this.state.tripManager.addTrip(new TripDetails(trip!, amount))
    }
}
