import {Component} from '@angular/core';
import {TripData} from "./TripData";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorStateMatcher} from "@angular/material/core";
import {AbstractControl, FormControl, FormGroupDirective, NgForm, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Trip, TripImage} from "../core/trip/Trip";
import {TripsProvider} from "../core/trip/TripsProvider";
import {State} from "../core/State";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";
import {ValidationResult} from "../core/ValidationResult";

@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
    styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent {
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    tripData = new TripData()
    notEmptyMatcher = new CustomErrorStateMatcher()
    unitPriceMatcher = new CustomErrorStateMatcher(() => !this.tripData.isUnitPriceValid().isValid)
    amountMatcher = new CustomErrorStateMatcher(() => !this.tripData.isAmountValid().isValid)

    imagesControl = new FormControl("", [
        Validators.required,
        () => {
            return this.tripData.isImagesValid() ? null : {"": true}
        }
    ])

    constructor(
        private snackBar: MatSnackBar,
        private state: State
    ) {}

    onAdd() {
        if (!this.tripData.isValid()) {
            this.snackBar.open("Proszę poprawnie wypełnić dany formularz", "OK", {duration: 1500})
            return
        }

        const trips = this.state.tripsProvider

        trips.add(new Trip(
            "",
            this.tripData.name!,
            this.tripData.country!,
            this.tripData.startDate!,
            this.tripData.endDate!,
            this.tripData.unitPrice!,
            this.tripData.amount!,
            this.tripData.desc!,
            this.tripData.img!,
            this.tripData.images
        ))

        this.snackBar.open("Wycieczka została dodana", "OK", {duration: 1500})
    }

    addImage(event: MatChipInputEvent): void {
        const value = (event.value || '').trim()

        if (value)
            this.tripData.images.push(value)

        // Clear the input value
        event.chipInput!.clear()
    }

    removeImage(image: TripImage): void {
        const index = this.tripData.images.indexOf(image)

        if (index >= 0) {
            this.tripData.images.splice(index, 1)
        }
    }

    editImage(image: TripImage, event: MatChipEditedEvent) {
        const value = event.value.trim()

        // Remove fruit if it no longer has a name
        if (!value) {
            this.removeImage(image)
            return
        }

        // Edit existing fruit
        const index = this.tripData.images.indexOf(image)

        if (index > 0) {
            this.tripData.images[index] = value
        }
    }
}

/** Error when invalid control is dirty, touched, or submitted; or when control is dirty & predicate is true */
export class CustomErrorStateMatcher implements ErrorStateMatcher {
    constructor(private predicate: () => boolean = () => false) {}

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) ||
            !!(control && control.dirty && this.predicate())
    }
}
