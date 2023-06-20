export interface ISystemUserRoleWrapper {
    roleId: string;
    roleName: string;
}

export class SystemUserRoleWrapper implements ISystemUserRoleWrapper {
    constructor(public roleId: string, 
        public roleName: string) {}
}
