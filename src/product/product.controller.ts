import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/customer/guards/user-jwt.guard';
import { UserRole } from 'src/common/enums/roles.enum';
import { Role } from 'src/common/decorators/role.decorator';
import { Serialize } from 'src/common/interceptors/serialze.interceptor';
import { CreateProductResponse } from './dto/create-product-response.dto';

@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // this endpoint protected for just admin user
  @Serialize(CreateProductResponse)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }
}
