import {FormControl, Validators} from "@angular/forms";
import {LoginService} from "../core/LoginService";
import {Notifier} from "../core/Notifier";
import {Router} from "@angular/router";
import {UserProvider} from "../core/user/UserProvider";
import {Directive} from "@angular/core";

@Directive()
export abstract class AuthBase {
    title = "AuthBase"
    emailFormControl = new FormControl('', [Validators.required, Validators.email])
    passwordFormControl = new FormControl('', [Validators.required])
    hide = true

    constructor(
        protected loginService: LoginService,
        protected notifier: Notifier,
        protected router: Router,
        protected userProvider: UserProvider
    ) {
        loginService.onAuthStateChange.subscribe(() => {
            if (this.loginService.isLoggedIn) {
                this.goToTrips()
            }
        })

        if (loginService.isLoggedIn) {
            this.goToTrips()
        }

        this.init()
    }

    protected abstract init(): void

    protected abstract onAction(email: string, password: string, isRemember: boolean): void

    private goToTrips() {
        this.router.navigate(['/trips'])
    }

    getEmailErrorMessage() {
        if (this.emailFormControl.hasError("required")) {
            return "This field cannot be empty"
        }

        return this.emailFormControl.hasError("email") ? "Not a valid email" : ""
    }

    getPasswordErrorMessage() {
        return this.passwordFormControl.hasError("required") ? "This field cannot be empty" : ""
    }
}
