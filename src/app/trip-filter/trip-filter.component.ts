import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ChipsMultiSelectComponent} from "../chips-multi-select/chips-multi-select.component";
import {TripsProvider} from "../core/trip/TripsProvider";
import {Trip} from "../core/trip/Trip";

@Component({
    selector: 'app-trip-filter',
    templateUrl: './trip-filter.component.html',
    styleUrls: ['./trip-filter.component.css']
})
export class TripFilterComponent implements OnInit {
    @Input() tripsProvider!: TripsProvider

    @Output() onFilterChanged = new EventEmitter<TripFilterComponent>();

    private _priceStart = 0
    private _priceEnd = 10000
    priceMin = 0
    priceMax = 10000

    private _dateStart = new Date()
    private _dateEnd = new Date()
    private dateMin: Date = new Date()
    private dateMax: Date = new Date()

    private countries = new Set<string>();
    private ratings = new Set<number>();

    private trips: Trip[] = []

    private countryFilter = (trip: Trip) =>
        this.countries.size == 0 || this.countries.has(trip.country)

    private ratingFilter = (trip: Trip) =>
        this.ratings.size == 0 || this.ratings.has(trip.rating.getStars())

    private dateFilter = (trip: Trip) =>
        this.dateStart <= trip.startDate && this.dateEnd >= trip.endDate

    private priceFilter = (trip: Trip) =>
        this.priceStart <= trip.unitPrice && trip.unitPrice <= this.priceEnd

    ngOnInit() {
        this.update()
    }

    private filterAll() {
        this.trips = this.filterBy(this.countryFilter, this.ratingFilter, this.dateFilter, this.priceFilter)
    }

    public update() {
        this.updateDateFilter()
        this.updatePriceFilter()
        this.filterAll()
    }

    private filterBy(...filters: ((trip: Trip) => boolean)[]) {
        let trips = this.tripsProvider.get()
        filters.forEach(filter => trips = trips.filter(filter))
        return trips
    }

    public get() {
        return this.trips
    }

    onCountrySelected(countriesComponent: ChipsMultiSelectComponent) {
        this.countries = new Set<string>()
        countriesComponent.getSelectedIndices().forEach(index =>
            this.countries.add(countriesComponent.getValues()[index]))
        this.update()
        this.onFilterChanged.emit(this)
    }

    collectCountries() {
        const countries = new Set<string>()
        this.tripsProvider.forEach(trip => countries.add(trip.country))
        return Array.from(countries.values())
    }

    onRatingSelected(ratingsComponent: ChipsMultiSelectComponent) {
        this.ratings = new Set<number>()
        ratingsComponent.getSelectedIndices().forEach(index =>
            this.ratings.add(ratingsComponent.getValues()[index]))
        this.update()
        this.onFilterChanged.emit(this)
    }

    collectRatings() {
        const ratings = new Set<number>()
        this.tripsProvider.forEach(trip => ratings.add(trip.rating.getStars()))
        return Array.from(ratings.values()).sort()
    }

    ratingStringifier(value: number) {
        return "★ " + value
    }

    // date

    private updateDateFilter() {
        const trips = this.filterBy(this.countryFilter, this.ratingFilter)
        let startDate = new Date()
        let endDate = new Date(0)

        trips.forEach(trip => {
            startDate = startDate < trip.startDate ? startDate : trip.startDate
            endDate = endDate > trip.endDate ? endDate : trip.endDate
        })

        if (startDate > endDate) {
            this.dateMin = new Date()
            this.dateMax = new Date()
        } else {
            this.dateMin = startDate
            this.dateMax = endDate
        }

        this._dateStart = this.dateMin
        this._dateEnd = this.dateMax
    }

    private onDateRangeChanged() {
        this.onFilterChanged.emit(this)
        this.updatePriceFilter()
    }

    set dateStart(value: Date) {
        this._dateStart = value > this.dateMin ? value : this.dateMin
        this.onDateRangeChanged()
    }

    get dateStart() {
        return this._dateStart
    }

    set dateEnd(value: Date) {
        if (value == null)
            return

        this._dateEnd = value < this.dateMax ? value : this.dateMax
        this.onDateRangeChanged()
    }

    get dateEnd() {
        return this._dateEnd
    }

    // price

    priceFormatter(value: number): string {
        if (value >= 1000)
            return '€' + Math.round(value / 1000) + 'k';
        return `€${value}`;
    }

    private updatePriceFilter() {
        const trips = this.filterBy(this.countryFilter, this.ratingFilter, this.dateFilter)
        let startPrice = +1 / 0
        let endPrice = 0

        trips.forEach(trip => {
            startPrice = Math.min(startPrice, trip.unitPrice)
            endPrice = Math.max(endPrice, trip.unitPrice)
        })

        if (startPrice > endPrice) {
            this.priceMin = 0
            this.priceMax = 0
        } else {
            this.priceMin = startPrice
            this.priceMax = endPrice
        }

        this._priceStart = this.priceMin
        this._priceEnd = this.priceMax
    }

    private onPriceRangeChanged() {
        this.filterAll()
        this.onFilterChanged.emit(this)
    }

    set priceStart(value: number) {
        this._priceStart = value
        this.onPriceRangeChanged()
    }

    get priceStart() {
        return this._priceStart
    }

    set priceEnd(value: number) {
        this._priceEnd = value
        this.onPriceRangeChanged()
    }

    get priceEnd() {
        return this._priceEnd
    }
}
