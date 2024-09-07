import { Expose, Transform } from "class-transformer";
import { ObjectId } from "mongoose";

export class CreateProductResponse {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id: ObjectId;    
    @Expose()
    name: string;
    @Expose()
    price: number;
    @Expose()
    description: string
}