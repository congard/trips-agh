import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Trip} from "../core/trip/Trip";
import {State} from "../core/State";
import {RatingBarComponent} from "../rating-bar/rating-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {formatDate} from "@angular/common";
import {Comment} from "../core/trip/Comment";
import {MatInput} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {Form, NgForm} from "@angular/forms";

@Component({
    selector: 'app-trip-info',
    templateUrl: './trip-info.component.html',
    styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {
    @ViewChild("inputForm") inputNickEl!: NgForm
    @ViewChild("inputPurchaseDateEl") inputPurchaseDateEl!: HTMLInputElement
    @ViewChild("inputCommentEl") inputCommentEl!: HTMLInputElement

    inputNick?: string
    inputDate?: Date
    inputComment?: string

    _trip?: Promise<Trip | null>

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private state: State,
        @Inject(LOCALE_ID) private locale: string
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get("id")
        this._trip = this.state.tripsProvider.getById(id!)
    }

    get trip() {
        return this._trip
    }

    goToTrips() {
        this.router.navigate(['/trips'])
    }

    rateTrip(trip: Trip, ratingBar: RatingBarComponent) {
        // TODO: check if has already been rated
        const trips = this.state.tripsProvider
        trips.rate(trip, ratingBar.getStars())
        this.snackBar.open("Dziękujemy za ocenę!", "OK", {duration: 1500})
    }

    sendComment(trip: Trip) {
        const errors: string[] = []

        const check = (pred: boolean, message: string) => {
            if (!pred) {
                errors.push(message)
            }
        }

        check(this.inputNick != undefined && this.inputNick!.length > 0,
            "Długość nicku musi być niezerowa")

        check(this.inputComment != undefined && this.inputComment.length >= 50 && this.inputComment.length <= 500,
            "Długość komentarza powinna być dłuższa niż 50 znaków, ale krótsza niż 500 znaków")

        check(this.inputDate == undefined || this.inputDate < new Date(),
            "Nie mogłeś uczestniczyć w wycieczce która jeszcze się nie odbyła. Wprowadź poprawną datę")

        if (errors.length == 0) {
            this.state.tripsProvider.comment(trip, new Comment(
                this.inputNick!, this.inputComment!,
                this.inputDate == undefined ? -1 : this.inputDate.getTime()
            ))

            this.inputNick = undefined
            this.inputComment = undefined
            this.inputDate = undefined

            this.inputNickEl.reset()
        } else {
            this.snackBar.open("Błąd! " + errors.join(", "), "OK", {duration: 5000})
        }
    }

    formatDate(dateMs: number, format: string) {
        return formatDate(dateMs, format, this.locale)
    }
}
