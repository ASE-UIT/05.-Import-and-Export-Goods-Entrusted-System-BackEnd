import { Injectable, NotFoundException } from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateQuotationDto } from './dtos/CreateQuotationDto';
import { UpdateQuotationDto } from './dtos/UpdateQuotationDto';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
  ) {}

  findAll(): Promise<Quotation[]> {
    return this.quotationModel.findAll();
  }

  findOne(id: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        id,
      },
    });
  }

  // Tạo Quotation mới
  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {
    return await this.quotationModel.create(quotationInfo);
  }

  getQuotationByTotalPrice(totalPrice: number): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        totalPrice,
      },
    });
  }

  getQuotationByDeliveryDate(deliveryDate: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        deliveryDate,
      },
    });
  }

  getQuotationByPickupDate(pickupDate: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        pickupDate,
      },
    });
  }

  getQuotationByQuotationDate(quotationDate: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        quotationDate,
      },
    });
  }

  getQuotationByExpiredDate(expiredDate: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        expiredDate,
      },
    });
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto) {
    const [numberOfAffectedRows, [updatedQuotation]] =
      await this.quotationModel.update(
        {
          totalPrice: updateQuotationDto.totalPrice,
          pickupDate: updateQuotationDto.pickupDate,
          deliveryDate: updateQuotationDto.deliveryDate,
          quotationDate: updateQuotationDto.quotationDate,
          expiredDate: updateQuotationDto.expiredDate,
        },
        {
          where: { quotationId: id },
          returning: true, // Trả về bản ghi đã cập nhật
        },
      );

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    return updatedQuotation; // Trả về người dùng đã cập nhật
  }
}
