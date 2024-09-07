import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { Customer } from 'src/customer/schema/customer.schema';

@Schema()
export class Order extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
    customer: Customer;

    @Prop([{
        product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true,min:1 },
    }])
    products: Array<{
        product: Product;
        price: number;
        quantity: number;
    }>;

    @Prop({ default: Date.now })
    orderDate: Date;

    @Prop()
    orderCost: number;
}
export type OrderDocument = HydratedDocument<Order>
export const OrderSchema = SchemaFactory.createForClass(Order);
