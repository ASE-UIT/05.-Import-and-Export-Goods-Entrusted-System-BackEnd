import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateShipmentDto,
  //UpdateShipmentDto,
} from './dtos/create-shipment.dto';
import { Shipment } from './models/shipment.model';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
import { QueryShipmentDto } from './dtos/query-shipment.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
import { Contract } from '@/contracts/models/contract.model';
import { Customer } from '@/customers/models/customer.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { Invoice } from '@/invoices/models/invoice.model';

type ShipemntResponse = {
  shipment: Shipment;
  tracking: ShipmentTracking;
  contract: Contract;
  quotationReqDetail: QuoteReqDetail;
  customer: Customer;
};

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment)
    private shipmentModel: typeof Shipment,
  ) {}
  async createShipment(body: CreateShipmentDto): Promise<Shipment> {
    try {
      const newShipment = await this.shipmentModel.create({
        shipmentType: body.shipmentType,
        contractId: body.contractId,
      });
      return newShipment;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Contract id not found');
      }
    }
  }

  // async updateShipment(
  //   shipmentId: string,
  //   body: UpdateShipmentDto,
  // ): Promise<Shipment> {
  //   try {
  //     const [affectedRows, [updateData]] = await this.shipmentModel.update(
  //       { ...body },
  //       { where: { id: shipmentId }, returning: true },
  //     );
  //     return updateData.dataValues as Shipment;
  //   } catch (err) {
  //     if (err instanceof TypeError) {
  //       throw new NotFoundException('Shipment not found');
  //     }
  //   }
  // }

  async findShipment(
    query: QueryShipmentDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<Shipment>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let shipment: { count: number; rows: Shipment[] };
    if (page && limit) {
      shipment = await this.shipmentModel.findAndCountAll({
        where: query,
        include: [
          {
            model: ShipmentTracking,
            attributes: ['status', 'location'],
          },
          {
            model: Contract,
            attributes: ['quotationId', 'endDate'],
            include: [
              {
                model: Quotation,
                attributes: ['quoteReqId', 'totalPrice'],
                include: [
                  {
                    model: QuotationReq,
                    attributes: ['customerId'],
                    include: [
                      {
                        model: Customer,
                        attributes: ['id', 'name'],
                      },
                      {
                        model: QuoteReqDetail,
                        attributes: ['destination', 'origin'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        offset: offset,
        limit: limit,
      });
    } else {
      shipment = await this.shipmentModel.findAndCountAll({
        where: query,
        include: [
          {
            model: ShipmentTracking,
            attributes: ['status', 'location'],
          },
          {
            model: Contract,
            attributes: ['quotationId', 'endDate'],
            include: [
              {
                model: Quotation,
                attributes: ['quoteReqId', 'totalPrice'],
                include: [
                  {
                    model: QuotationReq,
                    attributes: ['customerId'],
                    include: [
                      {
                        model: Customer,
                        attributes: ['id', 'name'],
                      },
                      {
                        model: QuoteReqDetail,
                        attributes: ['destination', 'origin'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    }

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: shipment.count,
      totalPages: page && limit ? Math.ceil(shipment.count / limit) : null,
      nextPage: page * limit < shipment.count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<Shipment> = {
      pagination: paginationInfo,
      results: shipment.rows,
    };
    return response;
  }

  async findShipmentById(id: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findOne({
      where: { id: id },
      include: [
        {
          model: ShipmentTracking,
          attributes: ['status', 'location'],
        },
        {
          model: Contract,
          attributes: ['quotationId', 'endDate'],
          include: [
            {
              model: Invoice,
              attributes: ['totalAmount'],
            },
            {
              model: Quotation,
              attributes: ['quoteReqId'],
              include: [
                {
                  model: QuotationReq,
                  attributes: ['customerId'],
                  include: [
                    {
                      model: Customer,
                      attributes: ['id', 'name'],
                    },
                    {
                      model: QuoteReqDetail,
                      attributes: ['destination', 'origin'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }
}
