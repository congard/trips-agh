import {TripDetails, TripStatus} from "./TripDetails";
import {State} from "../State";
import {Notification} from "../NotificationManager";

export class TripManager {
    public trips: TripDetails[] = []

    constructor(
        private state: State
    ) {}

    public addTrip(details: TripDetails) {
        this.trips.push(details)
        this.onTripAdded(details)
    }

    private onTripAdded(details: TripDetails) {
        if (details.getTripStatus() == TripStatus.Future) {
            this.notifyAboutFutureTrip(details)
        }
    }

    private notifyAboutFutureTrip(details: TripDetails) {
        const formatDate = (d: Date) => {
            return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
        }

        const trip = details.trip

        this.state.notificationManager.add(new Notification(
            "Nadchodząca wycieczka",
            `${formatDate(trip.startDate)}-${formatDate(trip.endDate)}: ${trip.name}, ${trip.country}`
        ))
    }

    private notifyAboutFutureTrips() {
        this.getFutureTrips().forEach(details => this.notifyAboutFutureTrip(details))
    }

    private getTrips(status: TripStatus) {
        return this.trips.filter(details => details.getTripStatus() == status)
    }

    public getPastTrips() {
        return this.getTrips(TripStatus.Past)
    }

    public getPresentTrips() {
        return this.getTrips(TripStatus.Present)
    }

    public getFutureTrips() {
        return this.getTrips(TripStatus.Future)
    }
}
