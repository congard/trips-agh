import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';

import {TripsComponent} from './trips/trips.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MaterialModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RatingBarComponent} from './rating-bar/rating-bar.component';
import {ChipsMultiSelectComponent} from './chips-multi-select/chips-multi-select.component';
import {TripFilterComponent} from './trip-filter/trip-filter.component';
import {CartSheet} from './cart-sheet/cart-sheet.component';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {CartComponent} from './cart/cart.component';
import {HistoryComponent} from './history/history.component';
import {NotificationsDialog} from './notifications-dialog/notifications-dialog.component';
import {TripInfoComponent} from './trip-info/trip-info.component';
import {CarouselComponent} from './carousel/carousel.component';
import {RatingOverviewComponent} from './rating-overview/rating-overview.component';

import {firebaseConfig} from "./firebaseConfig";
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {SignInComponent} from './auth/sign-in.component';
import {AccessErrorComponent} from './access-error/access-error.component';
import {ManageUsersComponent} from './manage-users/manage-users.component';
import {ManageTripsComponent} from './manage-trips/manage-trips.component';
import {EditTripDialog} from './edit-trip-dialog/edit-trip-dialog.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SignUpComponent} from './auth/sign-up.component';

@NgModule({
    declarations: [
        TripsComponent,
        RatingBarComponent,
        ChipsMultiSelectComponent,
        TripFilterComponent,
        CartSheet,
        AppComponent,
        MainComponent,
        CartComponent,
        HistoryComponent,
        NotificationsDialog,
        TripInfoComponent,
        CarouselComponent,
        RatingOverviewComponent,
        SignInComponent,
        AccessErrorComponent,
        ManageUsersComponent,
        ManageTripsComponent,
        EditTripDialog,
        PageNotFoundComponent,
        SignUpComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatRippleModule,
        MatToolbarModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
