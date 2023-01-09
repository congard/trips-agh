import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RatingBarComponent} from "../rating-bar/rating-bar.component";
import {Rating} from "../core/trip/Rating";
import {faStar, faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-rating-overview',
    templateUrl: './rating-overview.component.html',
    styleUrls: ['./rating-overview.component.scss']
})
export class RatingOverviewComponent implements AfterViewInit {
    @ViewChild("ratingBar")
    public ratingBar!: RatingBarComponent

    @Input() rating!: Rating

    @Output() onRatedEvent = new EventEmitter<RatingBarComponent>();

    faStar = faStar
    faUser = faUser

    ngAfterViewInit() {

    }
}
