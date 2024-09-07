import { Expose, Transform } from "class-transformer";
import { ObjectId, Types } from "mongoose";

export class CreateCustomerResponseExample {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id: ObjectId;    
    @Expose()
    name: string;
    @Expose()
    email: string;
    @Expose()
    phone: string;
    @Expose()
    address: string;
    @Expose()
    type: string;
}