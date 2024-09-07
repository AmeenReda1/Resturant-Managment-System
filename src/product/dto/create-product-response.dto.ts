import { Expose } from "class-transformer";

export class CreateProductResponse {
    @Expose()
    _id: string;
    @Expose()
    name: string;
    @Expose()
    price: number;
    @Expose()
    description: string
}