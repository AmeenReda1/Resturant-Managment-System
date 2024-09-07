import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from 'bcrypt';
import { UserRole } from "src/common/enums/roles.enum";

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  address: string;

  @Prop({ required: true })
  password: string;
  @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
  type: UserRole
}

export type CustomerDocument = HydratedDocument<Customer>;
export const CustomerSchema = SchemaFactory.createForClass(Customer)

CustomerSchema.pre('save', async function (next) {
  const customer = this as CustomerDocument;

  if (!customer.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);
  next();
});

