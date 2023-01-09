import {AfterContentInit, ChangeDetectorRef, Component} from '@angular/core';
import {Trip} from "../core/trip/Trip";
import {State} from "../core/State";
import {CartDetails} from "../core/CartDetails";
import {TripsProvider} from "../core/trip/TripsProvider";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements AfterContentInit {
    cart: CartDetails
    trips: TripsProvider

    constructor(
        private state: State,
        private cdr: ChangeDetectorRef
    ) {
        this.cart = state.cart
        this.trips = state.tripsProvider
    }

    items: CartItemDetails[] = []
    totalPrice: number = 0

    async ngAfterContentInit() {
        await this.updateData()
    }

    private async updateData() {
        // load items
        const items: CartItemDetails[] = []

        for (const [id, amount] of this.cart.get())
            items.push(new CartItemDetails((await this.trips.getById(id))!, amount));

        this.items = items

        // calculate total price
        let price = 0

        for (const [id, amount] of this.cart.get())
            price += amount * (await this.trips.getById(id))!.unitPrice

        this.totalPrice = price
    }

    async buy(tripId: string) {
        // buy trip
        const amount = this.cart.getAmount(tripId)
        await this.state.account.buyTrip(tripId, amount)

        // remove from cart
        this.cart.remove(tripId, amount)

        await this.updateData()
    }

    buyAll() {
        this.cart.get().forEach((amount, id) => this.buy(id))
    }
}

export class CartItemDetails {
    constructor(
        public trip: Trip,
        public amount: number
    ) {}
}
