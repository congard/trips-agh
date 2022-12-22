export class Trip {
    constructor(
        public id: number,
        public name: string,
        public country: string,
        public startDate: Date,
        public endDate: Date,
        public unitPrice: number,
        public amount: number,
        public desc: string,
        public img: string,
        public rating: number = 0,
        public ratingCount: number = 0
    ) {}

    public getStarsRating() {
        return Math.floor((this.ratingCount > 0 ? this.rating / this.ratingCount : 0) * 100) / 100
    }

    public getStars() {
        return Math.floor(this.getStarsRating())
    }
}
