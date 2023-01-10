import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CartDetails} from "../core/CartDetails";
import {TripsProvider} from "../core/trip/TripsProvider";
import {Trip} from "../core/trip/Trip";

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddTripComponent} from "../add-trip/add-trip.component";
import {TripData} from "../add-trip/TripData";
import {RatingBarComponent} from "../rating-bar/rating-bar.component";
import {TripFilterComponent} from "../trip-filter/trip-filter.component";
import {CartSheet} from "../cart-sheet/cart-sheet.component";
import {CartData} from "../cart-sheet/CartData";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {State} from "../core/State";
import {Router} from "@angular/router";

@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit, AfterViewInit {
    @ViewChild(TripFilterComponent) tripFilter: TripFilterComponent | undefined

    mostExpensiveId: string = ""
    leastExpensiveId: string = ""

    trips: TripsProvider
    cart: CartDetails

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
        private state: State
    ) {
        this.trips = state.tripsProvider
        this.cart = state.cart

        this.trips.onDataUpdateListeners.push(() => {
            this.tripFilter!.update()
            this.calcPriceBounds()
        })
    }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        // https://flexiple.com/angular/expressionchangedafterithasbeencheckederror/
        setTimeout(() => this.calcPriceBounds())
    }

    calcPriceBounds() {
        this.mostExpensiveId = ""
        this.leastExpensiveId = ""

        const trips = this.tripFilter!.get()
        trips.forEach(trip => {
            if (this.getAvailableAmount(trip) == 0)
                return

            if (this.mostExpensiveId.length == 0 || this.trips.getByIdCached(this.mostExpensiveId)!.unitPrice < trip.unitPrice) {
                this.mostExpensiveId = trip.id
            }

            if (this.leastExpensiveId.length == 0 || this.trips.getByIdCached(this.leastExpensiveId)!.unitPrice > trip.unitPrice) {
                this.leastExpensiveId = trip.id
            }
        })
    }

    getDateStr(date: Date) {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }

    getAvailableAmount(trip: Trip) {
        return trip.amount - this.cart.getAmount(trip.id)
    }

    addToCart(trip: Trip) {
        if (this.getAvailableAmount(trip) > 0)
            this.cart.add(trip.id, 1)

        if (this.getAvailableAmount(trip) == 0) {
            this.calcPriceBounds()
        }
    }

    removeFromCart(trip: Trip) {
        if (this.cart.getAmount(trip.id) > 0)
            this.cart.remove(trip.id, 1)

        if (this.getAvailableAmount(trip) == 1) {
            this.calcPriceBounds()
        }
    }

    removeTrip(trip: Trip) {
        this.cart.removeIf(id => id == trip.id)
        this.trips.remove(trip)
        this.tripFilter!.update()
        this.calcPriceBounds()

        this.snackBar.open("Usunięto wycieczkę: " + trip.name, "OK", {
            duration: 1500
        })
    }

    showTripInfo(trip: Trip) {
        this.router.navigate(['/trips', trip.id])
    }
}
