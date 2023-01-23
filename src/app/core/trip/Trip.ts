import {Rating} from "./Rating";
import {Comment} from "./Comment";

export class Trip {
    constructor(
        public id: string,
        public name: string,
        public country: string,
        public startDate: Date,
        public endDate: Date,
        public unitPrice: number,
        public amount: number,
        public desc: string,
        public img: string,
        public images: TripImage[],
        public rating: Rating = new Rating(),
        public comments: Comment[] = []
    ) {}

    public getStatus() {
        const date = new Date()

        if (this.startDate <= date && date <= this.endDate) {
            return TripStatus.Present
        } else if (this.endDate < date) {
            return TripStatus.Past
        } else {
            return TripStatus.Future
        }
    }
}

export type TripImage = string

export enum TripStatus {
    Past = "archiwalna",
    Present = "aktywna",
    Future = "nadchodząca"
}
