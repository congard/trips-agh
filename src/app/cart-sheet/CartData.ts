import {CartDetails} from "../CartDetails";
import {TripsProvider} from "../TripsProvider";

export class CartData {
    constructor(
        public cart: CartDetails,
        public trips: TripsProvider
    ) {}
}
