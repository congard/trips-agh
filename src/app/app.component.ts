import {Component} from '@angular/core';
import {CartDetails} from "./core/CartDetails";
import {CartSheet} from "./cart-sheet/cart-sheet.component";
import {CartData} from "./cart-sheet/CartData";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TripsProvider} from "./core/trip/TripsProvider";
import {Router} from "@angular/router";
import {NotificationManager} from "./core/NotificationManager";
import {State} from "./core/State";
import {MatDialog} from "@angular/material/dialog";
import {NotificationsDialog} from "./notifications-dialog/notifications-dialog.component";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    routes = [
        new Route("/", "Strona główna"),
        new Route("/trips", "Wycieczki"),
        new Route("/history", "Historia"),
        new Route("/add-trip", "Dodaj wycieczkę")
    ]

    cart: CartDetails
    notifications: NotificationManager

    constructor(
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private router: Router,
        private state: State
    ) {
        this.cart = state.cart
        this.notifications = state.notificationManager
    }

    showNotifications() {
        this.dialog.open(NotificationsDialog)
    }

    showCart() {
        this.bottomSheet.open(CartSheet, {
            data: new CartData(this.cart, this.state.tripsProvider) // TODO
        });
    }

    isRouteCurrent(route: Route) {
        return this.router.url == route.url
    }
}

export class Route {
    constructor(
        public url: string,
        public name: string
    ) {}
}
