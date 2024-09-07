import { Expose } from "class-transformer";

export class CreateCustomerResponseExample{
    @Expose()
    name:string;
    @Expose()
    email:string;
    @Expose()
    phone:string;
    @Expose()
    address:string;
    @Expose()
    type:string;
}