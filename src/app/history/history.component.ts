import {Component} from '@angular/core';
import {Account} from "../core/Account";
import {Sort} from "@angular/material/sort";
import {State} from "../core/State";
import {TripDetails} from "../core/trip/TripDetails";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
    sortedData: TripDetails[]

    constructor(
        private state: State
    ) {
        this.sortedData = state.tripManager.trips.slice()
    }

    sortData(sort: Sort) {
        const data = this.state.tripManager.trips.slice();

        if (!sort.active || sort.direction === "") {
            this.sortedData = data;
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
                    return this.compare(a.getTripStatus(), b.getTripStatus(), isAsc)
                case "startDate":
                    return this.compare(tripA.startDate, tripB.startDate, isAsc)
                case "endDate":
                    return this.compare(tripA.endDate, tripB.endDate, isAsc)
                case "unitPrice":
                    return this.compare(tripA.unitPrice, tripB.unitPrice, isAsc)
                case "tickets":
                    return this.compare(a.amount, b.amount, isAsc)
                default:
                    return 0;
            }
        });
    }

    private compare(a: any, b: any, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
