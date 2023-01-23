import {Injectable} from "@angular/core";
import {User} from "./user/User";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {firstValueFrom} from "rxjs";

export type id_t = string
export type amount_t = number

@Injectable({
    providedIn: 'root'
})
export class Cart {
    private items = new Map<id_t, amount_t>();

    constructor(
        private user: User,
        private db: AngularFireDatabase
    ) {
        // load items from cart
        if (user.isLoaded) {
            this.pull()
        } else {
            firstValueFrom(user.onChange).then(() => this.pull())
        }
    }

    private pull() {
        if (this.user.uid == undefined)
            return

        firstValueFrom(this.db.object<object>(`/users/${this.user.uid}/cart`).valueChanges()).then(obj=> {
            if (obj == null)
                return

            this.items.clear()

            Object.keys(obj).forEach(key => {
                // @ts-ignore
                this.items.set(key, obj[key] as number)
            })
        })
    }

    private update(id: id_t, amount: amount_t) {
        if (this.user.uid == undefined)
            return new Promise<void>((resolve, reject) => reject("uid is undefined"))

        const data = {
            [`/users/${this.user.uid}/cart/${id}`]: amount
        }

        return this.db.object<object>("/").update(data)
    }

    private delete(id: id_t) {
        return this.db.object<object>(`/users/${this.user.uid}/cart/${id}`).remove()
    }

    public add(id: id_t, amount: amount_t) {
        if (amount < 0)
            throw new Error("amount < 0")
        return this.change(id, amount)!
    }

    public remove(id: id_t, amount: amount_t) {
        if (amount < 0)
            throw new Error("amount < 0")
        return this.change(id, -amount)!
    }

    public change(id: id_t, amount: amount_t, sync: boolean = true) {
        const prev = this.items.has(id) ? this.items.get(id)! : 0;
        const newAmount = prev + amount

        const doChange = (localAction: () => any, syncAction: () => Promise<void>) => {
            localAction()

            if (!sync)
                return

            return new Promise<void>((resolve, reject) => {
                syncAction().then(resolve).catch(reason => {
                    this.change(id, -amount, false) // rollback local
                    reject(reason)
                })
            })
        }

        if (newAmount <= 0) {
            return doChange(
                () => this.items.delete(id),
                () => this.delete(id)
            )
        } else {
            return doChange(
                () => this.items.set(id, newAmount),
                () => this.update(id, newAmount)
            )
        }
    }

    public get() {
        return this.items
    }

    public getAmount(id: id_t) {
        return this.items.has(id) ? this.items.get(id)! : 0
    }

    public getTotalAmount() {
        let amount = 0
        this.items.forEach(value => amount += value)
        return amount
    }

    public removeIf(pred: (id: id_t) => boolean) {
        this.items.forEach((amount, id) => {
            if (pred(id)) {
                this.items.delete(id)
            }
        })
    }
}
