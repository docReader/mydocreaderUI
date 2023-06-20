export interface ISystemUserWrapper {
    userId: string;
    userName: string;
    userEmail: string;
    roleName: string;
    userType: string;
}

export class SystemUserWrapper implements ISystemUserWrapper {
    constructor(public userId: string, 
        public userName: string, 
        public userEmail: string, 
        public roleName: string, 
        public userType: string) {}
}
