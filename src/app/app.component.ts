import {Component} from '@angular/core';
import {Cart} from "./core/Cart";
import {CartSheet} from "./cart-sheet/cart-sheet.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Router} from "@angular/router";
import {NotificationManager} from "./core/NotificationManager";
import {MatDialog} from "@angular/material/dialog";
import {NotificationsDialog} from "./notifications-dialog/notifications-dialog.component";
import {LoginService} from "./core/LoginService";
import {User} from "./core/user/User";
import {Role, RoleHelper} from "./core/user/Role";
import {Notifier} from "./core/Notifier";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    routes = [
        new Route("/", "Strona główna"),
        new Route("/trips", "Wycieczki"),
        new Route("/history", "Historia", RoleHelper.values().filter(role => role != Role.Guest)),
    ]

    manageRoutes = [
        new ManageRoute("/manage/users", "Użytkownicy", "manage_accounts", [Role.Admin]),
        new ManageRoute("/manage/trips", "Wycieczki", "luggage", [Role.Manager, Role.Admin])
    ]

    constructor(
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private router: Router,
        public cart: Cart,
        public notifier: Notifier,
        public notifications: NotificationManager,
        public loginService: LoginService,
        public user: User
    ) {}

    showNotifications() {
        this.dialog.open(NotificationsDialog)
    }

    showCart() {
        this.bottomSheet.open(CartSheet);
    }

    getAvailableRoutes() {
        return this.routes.filter(route => route.roles.indexOf(this.user.role) >= 0)
    }

    getAvailableManageRoutes() {
        return this.manageRoutes.filter(route => route.roles.indexOf(this.user.role) >= 0)
    }

    logout() {
        this.loginService.logout().then(() => {
            this.router.navigate(["/"])
        }).catch(reason => this.notifier.showError(reason))
    }

    isRouteCurrent(route: Route) {
        return this.router.url == route.url
    }
}

export class Route {
    constructor(
        public url: string,
        public name: string,
        public roles: Role[] = RoleHelper.values()
    ) {}
}

export class ManageRoute extends Route {
    constructor(
        url: string,
        name: string,
        public icon: string,
        roles: Role[]
    ) {
        super(url, name, roles);
    }
}
