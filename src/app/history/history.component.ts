import {Component} from '@angular/core';
import {Sort, SortDirection} from "@angular/material/sort";
import {TripDetails} from "../core/trip/TripDetails";
import {User} from "../core/user/User";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
    sortedData: TripDetails[] = []
    data: TripDetails[] = []

    private sort: Sort = new class implements Sort {
        active: string = "";
        direction: SortDirection = "";
    }

    constructor(
        private user: User,
        notifier: Notifier
    ) {
        const fetchTrips = () => {
            user.getPurchasedTrips().then(trips => {
                this.data = trips
                this.sortData(this.sort)
            }).catch(reason => notifier.showError(reason))
        }

        if (user.isLoaded)
            fetchTrips()

        user.onChange.subscribe(() => fetchTrips())
    }

    sortData(sort: Sort) {
        const data = this.data.slice()
        this.sort = sort

        if (!sort.active || sort.direction === "") {
            this.sortedData = data
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === "asc";

            const tripA = a.trip
            const tripB = b.trip

            switch (sort.active) {
                case "name":
                    return this.compare(tripA.name, tripB.name, isAsc)
                case "country":
                    return this.compare(tripA.country, tripB.country, isAsc)
                case "status":
                    return this.compare(tripA.getStatus(), tripB.getStatus(), isAsc)
                case "startDate":
                    return this.compare(tripA.startDate, tripB.startDate, isAsc)
                case "endDate":
                    return this.compare(tripA.endDate, tripB.endDate, isAsc)
                case "unitPrice":
                    return this.compare(tripA.unitPrice, tripB.unitPrice, isAsc)
                case "tickets":
                    return this.compare(a.details.amount, b.details.amount, isAsc)
                default:
                    return 0;
            }
        });
    }

    private compare(a: any, b: any, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
