import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CartDetails} from "../CartDetails";
import {TripsProvider} from "../TripsProvider";
import {Trip} from "../Trip";

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddTripDialog} from "../add-trip-dialog/add-trip-dialog.component";
import {TripData} from "../add-trip-dialog/TripData";
import {RatingBarComponent} from "../rating-bar/rating-bar.component";
import {TripFilterComponent} from "../trip-filter/trip-filter.component";
import {CartSheet} from "../cart-sheet/cart-sheet.component";
import {CartData} from "../cart-sheet/CartData";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit, AfterViewInit {
    @ViewChild(TripFilterComponent) tripFilter: TripFilterComponent | undefined

    trips: TripsProvider = new TripsProvider()

    mostExpensiveId = -1
    leastExpensiveId = -1

    cart = new CartDetails()

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet
    ) {}

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        // https://flexiple.com/angular/expressionchangedafterithasbeencheckederror/
        setTimeout(() => this.calcPriceBounds())
    }

    calcPriceBounds() {
        this.mostExpensiveId = -1
        this.leastExpensiveId = -1

        const trips = this.tripFilter!.get()
        trips.forEach(trip => {
            if (this.getAvailableAmount(trip) == 0)
                return

            if (this.mostExpensiveId < 0 || this.trips.getById(this.mostExpensiveId)!.unitPrice < trip.unitPrice) {
                this.mostExpensiveId = trip.id
            }

            if (this.leastExpensiveId < 0 || this.trips.getById(this.leastExpensiveId)!.unitPrice > trip.unitPrice) {
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

    private addNewTrip(id: number, tripData: TripData) {
        this.trips.add(new Trip(
            id,
            tripData.name!,
            tripData.country!,
            tripData.startDate!,
            tripData.endDate!,
            tripData.unitPrice!,
            tripData.amount!,
            tripData.desc!,
            tripData.img!
        ))
        this.tripFilter!.update()
        this.calcPriceBounds()
    }

    addTrip() {
        const dialogRef = this.dialog.open(AddTripDialog, { width: "35%" });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined)
                return

            let lastId = -1
            this.trips.forEach(trip => { lastId = Math.max(trip.id, lastId) })
            this.addNewTrip(lastId + 1, result)
        })
    }

    rateTrip(trip: Trip, ratingBar: RatingBarComponent) {
        // TODO: check if has already been rated
        this.trips.rate(trip, ratingBar.getStars())
        this.snackBar.open("Dziękujemy za ocenę!", "OK", {
            duration: 1500
        })
    }

    showCart() {
        this.bottomSheet.open(CartSheet, {
            data: new CartData(this.cart, this.trips)
        });
    }
}
