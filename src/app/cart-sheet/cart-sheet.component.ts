import {Component} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Router} from "@angular/router";
import {memoize} from "@angular/cli/src/utilities/memoize";
import {Cart} from "../core/Cart";
import {TripsProvider} from "../core/trip/TripsProvider";

@Component({
    selector: 'app-cart-sheet',
    templateUrl: './cart-sheet.component.html',
    styleUrls: ['./cart-sheet.component.css']
})
export class CartSheet {
    constructor(
        private sheetRef: MatBottomSheetRef,
        private router: Router,
        public cart: Cart,
        private tripsProvider: TripsProvider
    ) {}

    @memoize
    getById(id: string) {
        return this.tripsProvider.getById(id)
    }

    @memoize
    async getTotalPrice() {
        let price = 0

        for (const [id, amount] of this.cart.get())
            price += amount * (await this.tripsProvider.getById(id))!.unitPrice

        return price
    }

    showCart() {
        this.router.navigate(['/cart']).then(() => this.sheetRef.dismiss())
    }
}
