import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument } from "mongoose"

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true,unique:true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({default:null})
  description:string

}
export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product)
