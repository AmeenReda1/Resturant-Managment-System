import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {

    @IsNotEmpty({ message: 'customer id is Required' })
    @IsString()
    customerId: string;

    @IsNotEmpty({ message: 'products is Required' })
    @IsArray()
    products: ProductDto[];
}
export class ProductDto {
    @IsNotEmpty({ message: 'product id is Required' })
    @IsString()
    productId: string;

    @IsNotEmpty({ message: 'Product quntity is required' })
    @IsNumber()
    quantity: number

}