import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, ProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomerService } from 'src/customer/customer.service';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model, Types } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { ProductDocument } from 'src/product/schema/product.schema';
import { Customer } from 'src/customer/schema/customer.schema';
import * as moment from 'moment';
import { IOrderProducts } from 'src/product/interfaces/order-products.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private customerService: CustomerService,
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }
  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const { customerId, products } = createOrderDto
    const exsitingCustomer: Customer = await this.customerService.findById(customerId)
    if (!exsitingCustomer) throw new NotFoundException(`There isn't customer with this customerId ${customerId}`)

    const orderProducts: IOrderProducts[] = await this.handleOrderProducts(products)

    const orderCost: number = await this.calcTotalOrderCost(orderProducts)

    const newOrder: Order = new this.orderModel({
      customer: customerId,
      products: orderProducts,
      orderCost,
    })
    const todayDate: string = this.convertDateToTodayDate() // save key in cache manager as the 2024-6-20 for example
    // when new product created so i need to delete the cache because this will make the report inconsistant
    await this.cacheManager.del(todayDate)
    return newOrder.save()
  }

  async dailyReport() {
    const startOfToday = moment().startOf('day').toDate();
    const endOfToday = moment().endOf('day').toDate();
    const todayDate: string = this.convertDateToTodayDate();
    const dailyReportData = await this.cacheManager.get(todayDate)

    if (dailyReportData) {
      console.log('from cache')
      return dailyReportData
    }

    const [revenueData, topSellingProductData] = await Promise.all([
      this.calculateTotalRevenue(startOfToday, endOfToday),
      this.findTopSellingProduct(startOfToday, endOfToday),
    ]);
    const result: Object = {
      todayTotalRevenue: revenueData.totalRevenue,
      topSellingProduct: topSellingProductData,
    }
    await this.cacheManager.set(todayDate, result)
    return result;

  }
  convertDateToTodayDate(date?: Date): string {
    if (date)
      return date.toISOString().split('T')[0]

    return new Date().toISOString().split('T')[0]
  }
  private async calculateTotalRevenue(startDate: Date, endDate: Date):Promise<{totalRevenue:number}> {
    const result = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$orderCost' },
        },
       
      },
      {
        $project:{
          _id:0,
          totalRevenue:1
        }
      },
      
    ]).exec();
    return result[0] || { totalRevenue: 0 };
  }

  private async findTopSellingProduct(startDate: Date, endDate: Date) {
    const result = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 2,
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          totalQuantity: 1,
          productDetails: {
            name: 1,
            price: 1,
          },
        },
      },

    ]).exec();

    return result || { productId: null, totalQuantity: 0, productDetails: {} };
  }

  private async handleOrderProducts(products: ProductDto[]): Promise<IOrderProducts[]> {
    // check if the productId is real product id in product table and get price of the this product
    const orderProducts: IOrderProducts[] = await Promise.all(products.map(async (item) => {
      // check here that the productId taht i sent is valid objectId
      if (!Types.ObjectId.isValid(item.productId)) throw new ConflictException(`This product id is invalid id ${item.productId}`)

      const product: ProductDocument = await this.productService.findById(item.productId)
      if (!product) throw new NotFoundException(`There isn't product with this Id ${item.productId}`)
      return {
        product: product._id,
        price: product.price,
        quantity: item.quantity
      }

    }))
    return orderProducts
  }

  private async calcTotalOrderCost(orderProducts: IOrderProducts[]): Promise<number> {
    return orderProducts.reduce((total, currentProduct) => total + currentProduct.price * currentProduct.quantity, 0)
  }
  async findAll(): Promise<Order[]> {
    const existingOrders: Order[] = await this.orderModel.find()
    return existingOrders
  }

  async findOne(id: string): Promise<Order> {
    const exsistingOrder: Order = await this.orderModel.findById(id)

    if (!exsistingOrder) throw new NotFoundException(`There isn't any order with this Id ${id}`)
    return exsistingOrder
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {

    const exsistingOrder = await this.orderModel.findById(id)

    if (!exsistingOrder) throw new NotFoundException(`There isn't any order with this Id ${id}`)

    const { customerId, products } = updateOrderDto
    let newCusomter = customerId || exsistingOrder.customer
    let newProducts: any = products || exsistingOrder.products
    let orderCost: number = exsistingOrder.orderCost
    if (products) {
      newProducts = await this.handleOrderProducts(products)
      orderCost = await this.calcTotalOrderCost(newProducts)
    }
    let updatedOrder: Order = await this.orderModel.findByIdAndUpdate(id, {
      customer: newCusomter,
      products: newProducts,
      orderCost
    }, { new: true })

    const todayDay: string = this.convertDateToTodayDate();
    const orderDate: string = this.convertDateToTodayDate(exsistingOrder.orderDate)
    // check if the order that i update is created today if true then delete the report data from cache
    //because this data will be inconsistant
    if (todayDay == orderDate) {
      await this.cacheManager.del(todayDay)
    }
    return updatedOrder
  }
}
