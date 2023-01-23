import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Observer} from 'rxjs';
import {LoginService} from "../core/LoginService";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const handleResult = (result: boolean) => {
                if (!result)
                    this.router.navigate(["/access-error"], {skipLocationChange: true})
                observer.next(result)
            }

            if (this.loginService.user == undefined) {
                this.loginService.onAuthStateChange.subscribe(() => {
                    handleResult(this.loginService.isLoggedIn)
                })
            } else {
                handleResult(this.loginService.isLoggedIn)
            }
        })
    }
}
