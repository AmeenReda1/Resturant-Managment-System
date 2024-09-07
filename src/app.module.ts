import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_PIPE } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      expandVariables: true,
    }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    CustomerModule,
    ProductModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe },
    AppService
  ],
})
export class AppModule { }
