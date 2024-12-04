import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CreateCustomerStrategy } from './strategies/create-customer/create-customer.strategy';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from './dtos/create-customer.dto';
import { UpdateCustomerStrategy } from './strategies/update-customer/update-customer.strategy';
import { QueryCustomerDto } from './dtos/query-customer.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { InjectModel } from '@nestjs/sequelize';
import { where } from 'sequelize';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    private createCustomerStrategy: CreateCustomerStrategy,
    private updateCustomerStrategy: UpdateCustomerStrategy,
  ) {}

  async findCustomer(
    customerInfo: QueryCustomerDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Customer>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // const { count, rows } = await Customer.findAndCountAll({
    //   where: customerInfo,
    //   attributes: { exclude: ['legalRepId'] },
    //   include: LegalRep,
    //   offset: offset,
    //   limit: limit,
    //   subQuery: true,
    //   distinct: true,
    // });

    const count = await this.customerModel.count({
      where: customerInfo,
      include: LegalRep,
      distinct: true,
    });

    const rows = await this.customerModel.findAll({
      where: customerInfo,
      attributes: { exclude: ['legalRepId'] },
      include: LegalRep,
      offset: offset,
      limit: limit,
      subQuery: true,
    });

    const paginationInfo: PaginationResponse = {
      currentPage: page,
      records: count,
      totalPages: Math.ceil(count / limit),
      nextPage: page * limit < count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<Customer> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ where: { id: id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  // creating services
  async createCustomer(customerInfo: CreateCustomerDto): Promise<Customer> {
    return await this.createCustomerStrategy.create(customerInfo);
  }

  // updating services
  async updateCustomer(
    customerID: string,
    updateInfo: UpdateCustomerDto,
  ): Promise<Customer> {
    const updatedResponse = await this.updateCustomerStrategy.update(
      customerID,
      updateInfo,
    );
    return updatedResponse;
  }
}
