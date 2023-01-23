import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Notifier {
    constructor(
        private snackBar: MatSnackBar
    ) {}

    public showError(reason: any, duration = 5000) {
        this.snackBar.open(`Błąd: ${reason}`, "OK", {duration: duration})
    }

    public showMessage(msg: string, duration = 3000) {
        this.snackBar.open(msg, "OK", {duration: duration})
    }
}
