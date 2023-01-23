import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Observer} from 'rxjs';
import {LoginService} from "../core/LoginService";
import {User} from "../core/user/User";
import {Role} from "../core/user/Role";

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private user: User,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const roles = route.data["roles"] as Role[];

            const handleResult = () => {
                const result = roles.indexOf(this.user.role) >= 0

                if (!result)
                    this.router.navigate(["/access-error"], {skipLocationChange: true})

                observer.next(result)
            }

            if (!this.user.isLoaded) {
                this.user.onChange.subscribe(() => {
                    handleResult()
                })
            } else {
                handleResult()
            }
        })
    }
}
