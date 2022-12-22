import {Component, Inject} from '@angular/core';
import {CartData} from "./CartData";
import {MAT_BOTTOM_SHEET_DATA} from "@angular/material/bottom-sheet";

@Component({
    selector: 'app-cart-sheet',
    templateUrl: './cart-sheet.component.html',
    styleUrls: ['./cart-sheet.component.css']
})
export class CartSheet {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        public data: CartData
    ) {}

    getTotalPrice() {
        let price = 0

        this.data.cart.get().forEach((amount, id) =>
            price += amount * this.data.trips.getById(id)!.unitPrice)

        return price
    }
}
