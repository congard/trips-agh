import {CartDetails} from "../core/CartDetails";
import {TripsProvider} from "../core/trip/TripsProvider";

export class CartData {
    constructor(
        public cart: CartDetails,
        public trips: TripsProvider
    ) {}
}
