import {Component} from '@angular/core';
import {AuthBase} from "./AuthBase";

@Component({
    selector: 'app-sign-up',
    templateUrl: './form.html',
    styleUrls: ['./styles.scss']
})
export class SignUpComponent extends AuthBase {
    protected override init() {
        this.title = "Zarejestruj się"
    }

    protected override onAction(email: string, password: string, isRemember: boolean) {
        this.loginService.register(email, password, isRemember).then(user => {
            this.userProvider.onUserRegistered(user.user!.uid, email)
        }).catch(reason => this.notifier.showError(reason))
    }
}
