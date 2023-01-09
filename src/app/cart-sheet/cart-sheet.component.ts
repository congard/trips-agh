import {Component, Inject} from '@angular/core';
import {CartData} from "./CartData";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Router} from "@angular/router";
import {Trip} from "../core/trip/Trip";
import {memoize} from "@angular/cli/src/utilities/memoize";

@Component({
    selector: 'app-cart-sheet',
    templateUrl: './cart-sheet.component.html',
    styleUrls: ['./cart-sheet.component.css']
})
export class CartSheet {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: CartData,
        private sheetRef: MatBottomSheetRef,
        private router: Router
    ) {}

    @memoize
    getById(id: string) {
        return this.data.trips.getById(id)
    }

    @memoize
    async getTotalPrice() {
        let price = 0

        for (const [id, amount] of this.data.cart.get())
            price += amount * (await this.data.trips.getById(id))!.unitPrice

        return price
    }

    showCart() {
        this.router.navigate(['/cart']).then(() => this.sheetRef.dismiss())
    }
}
