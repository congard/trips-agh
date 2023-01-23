import {AfterContentInit, Component} from '@angular/core';
import {Trip} from "../core/trip/Trip";
import {Cart} from "../core/Cart";
import {TripsProvider} from "../core/trip/TripsProvider";
import {User} from "../core/user/User";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements AfterContentInit {
    constructor(
        public cart: Cart,
        private tripsProvider: TripsProvider,
        private user: User,
        private notifier: Notifier
    ) {}

    items: CartItemDetails[] = []
    totalPrice: number = 0

    async ngAfterContentInit() {
        await this.updateData()
    }

    private async updateData() {
        // load items
        const items: CartItemDetails[] = []

        for (const [id, amount] of this.cart.get())
            items.push(new CartItemDetails((await this.tripsProvider.getById(id))!, amount));

        this.items = items

        // calculate total price
        let price = 0

        for (const [id, amount] of this.cart.get())
            price += amount * (await this.tripsProvider.getById(id))!.unitPrice

        this.totalPrice = price
    }

    buy(tripId: string) {
        // buy trip
        const amount = this.cart.getAmount(tripId)

        this.user.buyTrip(tripId, amount).then(() => {
            // remove from cart
            this.cart.remove(tripId, amount)

            this.updateData().catch(reason => this.notifier.showError(reason))
        }).catch(reason => this.notifier.showError(reason))
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
