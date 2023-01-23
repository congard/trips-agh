import {Component} from '@angular/core';
import {AuthBase} from "./AuthBase";

@Component({
    selector: 'app-sign-in',
    templateUrl: './form.html',
    styleUrls: ['./styles.scss']
})
export class SignInComponent extends AuthBase {
    protected override init() {
        this.title = "Zaloguj się"
    }

    protected override onAction(email: string, password: string, isRemember: boolean) {
        this.loginService.login(email, password, isRemember)
            .catch(reason => this.notifier.showError(reason))
    }
}
