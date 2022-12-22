import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

import {TripsComponent} from './trips/trips.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MaterialModule} from '../material.module';
import {AddTripDialog} from './add-trip-dialog/add-trip-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RatingBarComponent} from './rating-bar/rating-bar.component';
import {ChipsMultiSelectComponent} from './chips-multi-select/chips-multi-select.component';
import {TripFilterComponent} from './trip-filter/trip-filter.component';
import {CartSheet} from './cart-sheet/cart-sheet.component';

@NgModule({
    declarations: [
        TripsComponent,
        AddTripDialog,
        RatingBarComponent,
        ChipsMultiSelectComponent,
        TripFilterComponent,
        CartSheet
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatRippleModule,
        MatToolbarModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    ],
    bootstrap: [TripsComponent]
})

export class AppModule {
}
