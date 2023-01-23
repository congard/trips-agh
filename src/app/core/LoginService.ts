import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import User = firebase.User;

import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence
} from "firebase/auth";
import UserCredential = firebase.auth.UserCredential;
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    public user?: User | null = undefined

    public readonly onAuthStateChange = new Subject<void>()

    constructor(
        private db: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth
    ) {
        angularFireAuth.authState.subscribe(user => {
            this.user = user
            this.onAuthStateChange.next()
        })
    }

    public get isLoggedIn() {
        return this.user != null || this.user != undefined
    }

    public get isLoaded() {
        return this.user != undefined
    }

    private setRemember(isRemember: boolean) {
        return setPersistence(getAuth(), isRemember ? browserLocalPersistence : browserSessionPersistence)
    }

    public register(email: string, password: string, isRemember: boolean) {
        return new Promise<UserCredential>((resolve, reject) => {
            this.setRemember(isRemember).then(() => {
                this.angularFireAuth.createUserWithEmailAndPassword(email, password).then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public login(email: string, password: string, isRemember: boolean) {
        return new Promise<UserCredential>((resolve, reject) => {
            this.setRemember(isRemember).then(() => {
                this.angularFireAuth.signInWithEmailAndPassword(email, password).then(resolve).catch(reject)
            }).catch(reject)
        })
    }

    public logout() {
        return this.angularFireAuth.signOut()
    }
}
