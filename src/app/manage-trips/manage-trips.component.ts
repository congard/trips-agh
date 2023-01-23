import {Component, Inject, LOCALE_ID} from '@angular/core';
import {TripsProvider} from "../core/trip/TripsProvider";
import {formatDate} from "@angular/common";
import {Trip} from "../core/trip/Trip";
import {EditTripDialog} from "../edit-trip-dialog/edit-trip-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TripData} from "../edit-trip-dialog/TripData";
import {Router} from "@angular/router";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-manage-trips',
    templateUrl: './manage-trips.component.html',
    styleUrls: ['./manage-trips.component.scss']
})
export class ManageTripsComponent {
    constructor(
        @Inject(LOCALE_ID)
        private locale: string,
        private router: Router,
        public tripsProvider: TripsProvider,
        private dialog: MatDialog,
        private notifier: Notifier
    ) {}

    getDate(d: Date) {
        return formatDate(d, 'dd.MM.yyy', this.locale);
    }

    openTripPage(trip: Trip) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`/trips/${trip.id}`])
        );

        window.open(url, '_blank');
    }

    addTrip() {
        const data = new TripData()
        data.img = "assets/images/trip_default.png"
        data.images = ["assets/images/trip_default.png"]

        const dialogRef = this.dialog.open(EditTripDialog, {
            width: "35%",
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined)
                return

            this.tripsProvider.add((result as TripData).toTrip()).then(() => {
                this.notifier.showMessage("Wycieczka została dodana")
            }).catch(reason => this.notifier.showError(reason))
        })
    }

    editTrip(trip: Trip) {
        const dialogRef = this.dialog.open(EditTripDialog, {
            width: "35%",
            data: new TripData().fromTrip(trip)
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined)
                return

            this.tripsProvider.update(result).then(() => {
                this.notifier.showMessage("Wycieczka została zmodyfikowana")
            }).catch(reason => this.notifier.showError(reason))
        })
    }

    removeTrip(trip: Trip) {
        this.tripsProvider.remove(trip).then(() => {
            this.notifier.showMessage("Wycieczka została usunięta")
        }).catch(reason => this.notifier.showError(reason))
    }
}
