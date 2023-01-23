import {Component, Inject} from '@angular/core';
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TripImage} from "../core/trip/Trip";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";
import {TripData} from "./TripData";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-edit-trip-dialog',
    templateUrl: './edit-trip-dialog.component.html',
    styleUrls: ['./edit-trip-dialog.component.scss']
})
export class EditTripDialog {
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

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
        @Inject(MAT_DIALOG_DATA)
        public tripData: TripData,
        private dialogRef: MatDialogRef<EditTripDialog>,
        private snackBar: MatSnackBar
    ) {}

    onAdd() {
        if (!this.tripData.isValid()) {
            this.snackBar.open("Proszę poprawnie wypełnić dany formularz", "OK", {duration: 1500})
            return
        }

        this.dialogRef.close(this.tripData)
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
