import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CustomerService } from '../customer.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-user') {
  constructor(private readonly customerService: CustomerService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, passsword: string) {
    const { exsitingCustomer, token } = await this.customerService.validateUser(email, passsword);
    if (exsitingCustomer && token) return { exsitingCustomer, token };
    else return null;
  }
}
