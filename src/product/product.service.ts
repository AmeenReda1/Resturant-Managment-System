import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {

    const { name } = createProductDto
    const exsistingProduct = await this.productModel.findOne({ name })
    if (exsistingProduct) throw new ConflictException(`There is a product with the same name ${name}`)
    const newProduct = await this.productModel.create(createProductDto)
    return newProduct;

  }
  async findById(productId: string): Promise<ProductDocument> {
    const exsistingProduct: ProductDocument = await this.productModel.findById(productId)
    if (!exsistingProduct) throw new NotFoundException(`There isn't product with this Is ${productId}`)
    return exsistingProduct
  }
}
