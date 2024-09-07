import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({message:'Product name is required'})
    @IsString()
    name:string;

    @IsNotEmpty({message:'Product price is required'})
    @IsNumber()
    price:number;

    @IsOptional()
    @IsString()
    description:string;
}
