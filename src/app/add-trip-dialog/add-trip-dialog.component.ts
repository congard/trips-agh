import {Component} from '@angular/core';
import {TripData} from "./TripData";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-add-trip-dialog',
    templateUrl: './add-trip-dialog.component.html',
    styleUrls: ['./add-trip-dialog.component.css']
})
export class AddTripDialog {
    tripData = new TripData()
    notEmptyMatcher = new CustomErrorStateMatcher()
    unitPriceMatcher = new CustomErrorStateMatcher(() => !this.tripData.isUnitPriceValid().isValid)
    amountMatcher = new CustomErrorStateMatcher(() => !this.tripData.isAmountValid().isValid)

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AddTripDialog>,
        private snackBar: MatSnackBar
    ) {}

    onAdd() {
        if (!this.tripData.isValid()) {
            this.snackBar.open("Proszę poprawnie wypełnić dany formularz", "OK", {duration: 1500})
            return
        }

        this.dialogRef.close(this.tripData)
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
