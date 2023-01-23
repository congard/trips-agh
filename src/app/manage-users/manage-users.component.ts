import {Component} from '@angular/core';
import {UserProvider} from "../core/user/UserProvider";
import {Sort, SortDirection} from "@angular/material/sort";
import {UserDetails} from "../core/user/UserDetails";
import {Role, RoleHelper} from "../core/user/Role";
import {Notifier} from "../core/Notifier";

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {
    sortedData: UserDetails[]

    roles = RoleHelper.values().filter(role => role != Role.Guest)

    private sort = new class implements Sort {
        active: string = "";
        direction: SortDirection = "";
    }

    constructor(
        public userProvider: UserProvider,
        private notifier: Notifier
    ) {
        userProvider.loadUsers(true)
        this.sortedData = userProvider.users.slice()

        userProvider.onUsersChange.subscribe(() => {
            this.sortedData = userProvider.users.slice()
            this.sortData(this.sort)
        })
    }

    getIconForRole(role: Role) {
        switch (role) {
            case Role.Banned: return "block"
            case Role.User: return "person"
            case Role.Manager: return "shield"
            case Role.Admin: return "security"
            default: return "question_mark"
        }
    }

    setRole(email: string, role: Role) {
        this.userProvider.updateUserByEmail(email, {role: role}).then(() => {
            this.notifier.showMessage(`Dla użytkownika ${email} rola została zmieniona na ${role}`)
        }).catch(reason => this.notifier.showError(reason));
    }

    sortData(sort: Sort) {
        if (!sort.active || sort.direction === "")
            return;

        this.sort = sort

        this.sortedData = this.sortedData.sort((a, b) => {
            const isAsc = sort.direction === "asc";

            switch (sort.active) {
                case "email":
                    return this.compare(a.email, b.email, isAsc)
                case "role":
                    return this.compare(a.role, b.role, isAsc)
                default:
                    return 0;
            }
        });
    }

    private compare(a: any, b: any, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
