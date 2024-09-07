import { Expose } from "class-transformer";

export class CreateCustomerResponseExample{
    @Expose()
    _id: string;
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