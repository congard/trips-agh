export enum Role {
    Guest = "guest",
    Banned = "banned",
    User = "user",
    Manager = "manager",
    Admin = "admin"
}

export class RoleHelper {
    public static values() {
        return [Role.Guest, Role.Banned, Role.User, Role.Manager, Role.Admin]
    }
}
