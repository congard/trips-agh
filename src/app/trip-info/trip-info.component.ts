import {AfterViewInit, Component, Inject, LOCALE_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Trip} from "../core/trip/Trip";
import {RatingBarComponent} from "../rating-bar/rating-bar.component";
import {formatDate} from "@angular/common";
import {Comment} from "../core/trip/Comment";
import {NgForm} from "@angular/forms";
import {TripsProvider} from "../core/trip/TripsProvider";
import {User} from "../core/user/User";
import {firstValueFrom} from "rxjs";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-trip-info',
    templateUrl: './trip-info.component.html',
    styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements AfterViewInit {
    @ViewChild("inputForm") inputNickEl!: NgForm
    @ViewChild("inputPurchaseDateEl") inputPurchaseDateEl!: HTMLInputElement
    @ViewChild("inputCommentEl") inputCommentEl!: HTMLInputElement

    inputNick?: string
    inputDate?: Date
    inputComment?: string

    trip: Trip | null = null

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notifier: Notifier,
        private tripsProvider: TripsProvider,
        private user: User,
        @Inject(LOCALE_ID) private locale: string
    ) {}

    isRated: Promise<boolean> = new Promise<boolean>(resolve => resolve(false))

    ngAfterViewInit() {
        const id = this.route.snapshot.paramMap.get("id")

        this.tripsProvider.getById(id!).then(trip => {
            this.trip = trip

            this.isRated = new Promise<boolean>(async resolve => {
                const _isRated = () =>
                    resolve(this.trip != null && this.user.isTripRated(this.trip.id))

                if (this.user.isLoaded) {
                    _isRated()
                } else {
                    await firstValueFrom(this.user.onChange)
                    _isRated()
                }
            })
        })
    }

    goToTrips() {
        this.router.navigate(['/trips'])
    }

    rateTrip(trip: Trip, ratingBar: RatingBarComponent) {
        this.user.rateTrip(trip.id, ratingBar.getStars()).then(() => {
            this.notifier.showMessage("Dziękujemy za ocenę!")
        }).catch(reason => this.notifier.showError(reason))
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
            this.tripsProvider.comment(trip, new Comment(
                this.inputNick!, this.inputComment!,
                this.inputDate == undefined ? -1 : this.inputDate.getTime()
            )).then(() => {
                this.inputNick = undefined
                this.inputComment = undefined
                this.inputDate = undefined

                this.inputNickEl.reset()

                this.notifier.showMessage("Komentarz został dodany")
            }).catch(reason => this.notifier.showError(reason))
        } else {
            this.notifier.showError(errors.join(", "))
        }
    }

    formatDate(dateMs: number, format: string) {
        return formatDate(dateMs, format, this.locale)
    }
}
