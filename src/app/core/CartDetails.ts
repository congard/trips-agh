export type id_t = string
export type amount_t = number

export class CartDetails {
    private items = new Map<id_t, amount_t>();

    public add(id: id_t, amount: amount_t) {
        if (amount < 0)
            throw new Error("amount < 0")
        const prev = this.items.has(id) ? this.items.get(id)! : 0;
        this.items.set(id, prev + amount)
    }

    public remove(id: id_t, amount: amount_t) {
        if (amount < 0)
            throw new Error("amount < 0")

        const prev = this.items.has(id) ? this.items.get(id)! : 0;
        const newAmount = prev - amount

        if (newAmount <= 0) {
            this.items.delete(id)
        } else {
            this.items.set(id, newAmount)
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
