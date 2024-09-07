import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { LocalStrategy } from './strategies/user-local.strategy';
import { JwtStrategy } from './strategies/user-jwt.strategy';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: `${configService.getOrThrow<string>('JWT_SECRET')}`,
        signOptions: {
          expiresIn: `${configService.getOrThrow<string>('JWT_EXPIRE_In')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, JwtService, LocalStrategy, JwtStrategy],
  exports: [CustomerService]
})
export class CustomerModule { }
