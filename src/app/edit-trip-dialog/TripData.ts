import {ValidationResult} from "../core/ValidationResult";
import {Trip, TripImage} from "../core/trip/Trip";

export class TripData {
    public id?: string
    public name?: string
    public country?: string
    public startDate?: Date
    public endDate?: Date
    public unitPrice?: number
    public amount?: number
    public desc?: string
    public img?: string
    public images: TripImage[] = []

    private fieldCannotBeEmpty = "Pole nie może być puste"

    public isNameValid() {
        return new ValidationResult(this.name != undefined && this.name.length > 0, this.fieldCannotBeEmpty)
    }

    public isCountryValid() {
        return new ValidationResult(this.country != undefined, this.fieldCannotBeEmpty)
    }

    public isStartDateValid() {
        return new ValidationResult(this.startDate != undefined, this.fieldCannotBeEmpty)
    }

    public isEndDateValid() {
        if (this.endDate == undefined)
            return new ValidationResult(false, this.fieldCannotBeEmpty);

        if (this.isStartDateValid().isValid && this.startDate! > this.endDate!)
            return new ValidationResult(false, "Data zakończenia jest mniejsza od daty rozpoczęcia")

        return new ValidationResult(true)
    }

    public isUnitPriceValid() {
        if (this.unitPrice == undefined)
            return new ValidationResult(false, this.fieldCannotBeEmpty);
        return new ValidationResult(this.unitPrice > 0, "Cena musi być większa od 0")
    }

    public isAmountValid() {
        if (this.amount == undefined)
            return new ValidationResult(false, this.fieldCannotBeEmpty);
        return new ValidationResult(this.amount > 0, "Ilość musi być większa od 0")
    }

    public isDescValid() {
        return new ValidationResult(this.desc != undefined, this.fieldCannotBeEmpty)
    }

    public isImgValid() {
        return new ValidationResult(this.img != undefined, this.fieldCannotBeEmpty)
    }

    public isImagesValid() {
        return new ValidationResult(this.images.length > 0, this.fieldCannotBeEmpty)
    }

    public isValid() {
        return this.isNameValid().isValid &&
            this.isCountryValid().isValid &&
            this.isStartDateValid().isValid &&
            this.isEndDateValid().isValid &&
            this.isUnitPriceValid().isValid &&
            this.isAmountValid().isValid &&
            this.isDescValid().isValid &&
            this.isImgValid().isValid &&
            this.isImagesValid()
    }

    public fromTrip(trip: Trip): TripData {
        this.id = trip.id
        this.name = trip.name
        this.country = trip.country
        this.startDate = trip.startDate
        this.endDate = trip.endDate
        this.unitPrice = trip.unitPrice
        this.amount = trip.amount
        this.desc = trip.desc
        this.img = trip.img
        this.images = trip.images
        return this;
    }

    public toTrip(): Trip {
        return new Trip(
            this.id == undefined ? "" : this.id,
            this.name!,
            this.country!,
            this.startDate!,
            this.endDate!,
            this.unitPrice!,
            this.amount!,
            this.desc!,
            this.img!,
            this.images!
        )
    }
}
