import {Role} from "./Role";

export class UserDetails {
    constructor(
        public email: string,
        public role: Role,
        public rated?: object,
        public purchased?: object
    ) {}
}
