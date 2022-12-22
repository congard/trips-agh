import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faStar as faStarSolid} from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'app-rating-bar',
    templateUrl: './rating-bar.component.html',
    styleUrls: ['./rating-bar.component.css']
})
export class RatingBarComponent {
    @Input() starsMaxCount: number = 5
    @Input() starsCount: number = 0
    @Input() isRated: boolean = false
    @Input() color: string = "yellow"
    @Input() ratedColor: string = "red"
    @Input() canBeRated: boolean = true

    @Output() onRatedEvent = new EventEmitter<RatingBarComponent>();

    starSolid = faStarSolid
    starRegular = faStarRegular

    previewStarsCount = 0

    public getStars() {
        return Math.floor(this.previewStarsCount < 1 ? this.starsCount : this.previewStarsCount)
    }

    public setStars(count: number, isRated = false) {
        this.starsCount = count
        this.isRated = isRated
    }

    public rate(count: number) {
        if (this.canBeRated) {
            this.setStars(count, true)
            this.onRatedEvent.emit(this)
        }
    }

    public previewStars(count: number) {
        if (this.canBeRated) {
            this.previewStarsCount = count
        }
    }

    public getColor() {
        return this.isRated ? this.ratedColor : this.color
    }
}
