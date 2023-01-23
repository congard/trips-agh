import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TripsComponent} from "./trips/trips.component";
import {MainComponent} from "./main/main.component";
import {CartComponent} from "./cart/cart.component";
import {HistoryComponent} from "./history/history.component";
import {TripInfoComponent} from "./trip-info/trip-info.component";
import {SignInComponent} from "./auth/sign-in.component";
import {AuthGuard} from "./guard/auth.guard";
import {AccessErrorComponent} from "./access-error/access-error.component";
import {Role} from "./core/user/Role";
import {RoleGuard} from "./guard/role.guard";
import {ManageUsersComponent} from "./manage-users/manage-users.component";
import {ManageTripsComponent} from "./manage-trips/manage-trips.component";
import {SignUpComponent} from "./auth/sign-up.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
    {path: "", component: MainComponent},
    {path: "trips", component: TripsComponent},
    {path: "trips/:id", component: TripInfoComponent, canActivate: [AuthGuard]},
    {path: "cart", component: CartComponent, canActivate: [AuthGuard]},
    {path: "history", component: HistoryComponent, canActivate: [AuthGuard]},
    {path: "sign-in", component: SignInComponent},
    {path: "sign-up", component: SignUpComponent},
    {path: "access-error", component: AccessErrorComponent},
    {path: "manage/users", component: ManageUsersComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: [Role.Admin]}},
    {path: "manage/trips", component: ManageTripsComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: [Role.Manager, Role.Admin]}},
    {path: "**", component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
