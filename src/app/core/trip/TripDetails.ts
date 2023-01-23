import {Trip} from "./Trip";
import {PurchasedTripDetails} from "../user/PurchasedTripDetails";

export class TripDetails {
    constructor(
        public trip: Trip,
        public details: PurchasedTripDetails
    ) {}
}
