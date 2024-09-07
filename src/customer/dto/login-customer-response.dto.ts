import { Expose } from "class-transformer";

export class LoginCustomerResponseDto {
    name: string;
    phone: string;
    email: string;
    address: string;
    token: string;

    constructor(user,token){
        this.name= user.name
        this.phone = user.phone,
        this.email = user.email,
        this.address = user.address,
        this.token = token  
    }

}