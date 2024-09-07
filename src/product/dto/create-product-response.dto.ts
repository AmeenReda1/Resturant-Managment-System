import { Expose } from "class-transformer";

export class CreateProductResponse {
    @Expose()
    name: string;
    @Expose()
    price: number;
    @Expose()
    description: string
}