import { Controller, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LocalAuthGuard } from './guards/local-user.guard';
import { Request } from 'express';
import { Customer } from './schema/customer.schema';
import { Serialize } from 'src/common/interceptors/serialze.interceptor';
import { LoginCustomerResponseDto } from './dto/login-customer-response.dto';
import { CreateCustomerResponseExample } from './dto/ceate-customer-response.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Serialize(CreateCustomerResponseExample)
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any) {
    const user = req.user['exsitingCustomer']
    const token = req.user['token']
    return new LoginCustomerResponseDto(user, token)
  }

}
