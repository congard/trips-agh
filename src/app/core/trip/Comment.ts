export class Comment {
    constructor(
        public nick: string,
        public comment: string,
        public purchaseDate: number = -1,
        public date: number = Date.now()
    ) {}
}
