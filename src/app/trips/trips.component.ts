import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Cart} from "../core/Cart";
import {TripsProvider} from "../core/trip/TripsProvider";
import {Trip} from "../core/trip/Trip";

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TripFilterComponent} from "../trip-filter/trip-filter.component";
import {Router} from "@angular/router";
import {LoginService} from "../core/LoginService";
import {User} from "../core/user/User";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit, AfterViewInit {
    @ViewChild(TripFilterComponent) tripFilter: TripFilterComponent | undefined

    mostExpensiveId: string = ""
    leastExpensiveId: string = ""

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
        private user: User,
        private notifier: Notifier,
        public tripsProvider: TripsProvider,
        public cart: Cart,
        public loginService: LoginService
    ) {
        tripsProvider.onDataUpdateListeners.push(() => {
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

            if (this.mostExpensiveId.length == 0 || this.tripsProvider.getByIdCached(this.mostExpensiveId)!.unitPrice < trip.unitPrice) {
                this.mostExpensiveId = trip.id
            }

            if (this.leastExpensiveId.length == 0 || this.tripsProvider.getByIdCached(this.leastExpensiveId)!.unitPrice > trip.unitPrice) {
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
        if (this.getAvailableAmount(trip) > 0) {
            this.cart.add(trip.id, 1).catch(reason =>
                this.notifier.showError(reason))
        }

        if (this.getAvailableAmount(trip) == 0) {
            this.calcPriceBounds()
        }
    }

    removeFromCart(trip: Trip) {
        if (this.cart.getAmount(trip.id) > 0) {
            this.cart.remove(trip.id, 1).catch(reason =>
                this.notifier.showError(reason))
        }

        if (this.getAvailableAmount(trip) == 1) {
            this.calcPriceBounds()
        }
    }

    showTripInfo(trip: Trip) {
        this.router.navigate(['/trips', trip.id])
    }
}
