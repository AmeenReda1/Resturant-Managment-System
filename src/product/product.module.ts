import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { JwtAuthGuard } from 'src/customer/guards/user-jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],
  controllers: [ProductController],
  providers: [ProductService,JwtAuthGuard,RoleGuard],
  exports:[ProductService]
})
export class ProductModule { }
