import {FixedLengthArray} from "../FixedLengthArray";
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
}

export type TripImage = string
