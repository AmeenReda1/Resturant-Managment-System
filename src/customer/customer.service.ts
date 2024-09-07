import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schema/customer.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private jwtService: JwtService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {

    const { email } = createCustomerDto;
    const exsitingCustomer = await this.customerModel.findOne({ email })
    if (exsitingCustomer) throw new ConflictException(`This email already taken by anthor customer ${email}`)

    const createCustomer = await this.customerModel.create(createCustomerDto)
    return createCustomer
  }
  async validateUser(email: string, pass: string) {
    const exsitingCustomer = await this.customerModel.findOne({ email }).exec()
    if (!exsitingCustomer) {
      throw new NotFoundException(`User email or password not correct `);
    }

    const checkPasword = await bcrypt.compare(pass, exsitingCustomer.password);
    if (!checkPasword) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: exsitingCustomer._id,
      email: exsitingCustomer.email,
      name: exsitingCustomer.name,
      type: exsitingCustomer.type,
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { exsitingCustomer, token };
  }
  async findById(id: string): Promise<Customer> {
    const existingUser = await this.customerModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`There isn't customer with this id`);
    }
    return existingUser;
  }
}
