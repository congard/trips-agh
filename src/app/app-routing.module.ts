import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TripsComponent} from "./trips/trips.component";
import {MainComponent} from "./main/main.component";
import {AddTripComponent} from "./add-trip/add-trip.component";
import {CartComponent} from "./cart/cart.component";
import {HistoryComponent} from "./history/history.component";
import {TripInfoComponent} from "./trip-info/trip-info.component";

const routes: Routes = [
    {path: "", component: MainComponent},
    {path: "trips", component: TripsComponent},
    {path: "trips/:id", component: TripInfoComponent},
    {path: "add-trip", component: AddTripComponent},
    {path: "cart", component: CartComponent},
    {path: "history", component: HistoryComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
