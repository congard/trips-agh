# Trips

**Disclaimer:** DO NOT USE ANY PARTS OF THIS REPO IN A REAL WORLD PROJECT! IT'S TOTALLY UNSAFE!

This repository shows my experiments with TypeScript, Angular and Firebase.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

## Tips and observations

Some observations on how this project can be improved / how to start a new project:

1. Instead of Firebase Realtime database use Firestore database.
   It supports triggers and some other useful stuff for such a project
2. Or, even better, write your own backend. Use NodeJs with SQL/MongoDB/etc
3. Design architecture, then write code
4. Try to avoid callback hell when it's possible
5. Take full advantage of async programming: use promises, observables, subjects etc
6. Be careful with await on non-async function!
7. Maybe use less pink?..

## Screenshots

![main](images/main.png)
![trips](images/trips.png)
![cart_sheet](images/cart_sheet.png)
![history](images/history.png)
![manage_users](images/manage_users.png)
![manage_trips](images/manage_trips.png)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
