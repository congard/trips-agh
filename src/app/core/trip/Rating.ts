export class Rating {
    constructor(
        public ratingArray: number[] = [0, 0, 0, 0, 0]
    ) {}

    public getRatingsCount() {
        return this.ratingArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    public getTotalRating() {
        return this.ratingArray.reduce((accumulator, currentValue, index) =>
            accumulator + currentValue * (index + 1), 0)
    }

    public getStarsRating() {
        const ratingsCount = this.getRatingsCount()
        const totalRating = this.getTotalRating()
        return Math.floor((ratingsCount > 0 ? totalRating / ratingsCount : 0) * 100) / 100
    }

    public getStars() {
        return Math.floor(this.getStarsRating())
    }
}
