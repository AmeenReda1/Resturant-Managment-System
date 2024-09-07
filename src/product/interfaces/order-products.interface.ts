import { Types } from "mongoose";

export interface IOrderProducts {
    product: Types.ObjectId;
    price: number;
    quantity: number;
}