import { UserWrapper } from "./UserWrapper";
export class LoginResponseWrapper {
    id: number;  
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    activated: boolean;    
    langKey: string;    
    imageUrl: string;
    token: string;
    resetDate: any;
    public user: UserWrapper;
  }