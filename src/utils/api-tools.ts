import {UserRoleEnum} from '@store/user-store'
import {Modules, UserAdditionalPermissions} from '@interfaces/common'

export const concatApiUrl = (url: string): string => {
    return process.env.API_URL + url
}

export class Permissions {
    private _permissions: UserAdditionalPermissions | null;
    private _module: Modules;

    constructor(permissions?: UserAdditionalPermissions, module?: Modules) {
        this._permissions = permissions || null;
        this._module = module || Modules.NONE
    }

    set module(module: Modules) {
        this._module = module;
    }

    get module() {
        return this._module;
    }

    set permissions(permissions: UserAdditionalPermissions) {
        this._permissions = permissions;
    }

    get permissions(): UserAdditionalPermissions {
        return this._permissions!;
    }

    public setRole(newRole: UserRoleEnum) {
        if (this._permissions) {
            this._permissions.role = newRole;
        }
    }

    public hasAddPermissionsFor(module: Modules) {
        if (this._permissions === null) {
            throw new Error("User permissions isn't specified");
        }
        return this._permissions.modules.includes(module);
    }

    public roleIsIn(roles: UserRoleEnum[], deep: boolean = false): boolean {
        if (this._permissions === null) {
            throw new Error("User permissions isn't specified");
        }
        if (roles.includes(this._permissions.role)) {
            if (deep) {
                if (this._module === Modules.NONE) {
                    return false;
                }
                return !this._permissions.modules.includes(this._module);
            }
            return true;
        }
        return false;
    }

    // [CLIENT] INCLUDES CLIENT
    public roleIsNotIn(roles: UserRoleEnum[], deep: boolean = false): boolean {
        if (this._permissions === null) {
            throw new Error("User permissions isn't specified");
        }
        if (!roles.includes(this._permissions.role)) {
            return true;
        }

        if (deep) {
            if (this._module === Modules.NONE) {
                return false;
            }
            return this._permissions.modules.includes(this._module);
        }
        return false;
    }
}
