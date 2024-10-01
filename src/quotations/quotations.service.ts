import { Injectable } from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';

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

  async create(quotation: Quotation): Promise<Quotation> {
    return this.quotationModel.create(quotation);
  }

  async update(
    id: number,
    quotation: Quotation,
  ): Promise<[number, Quotation[]]> {
    return this.quotationModel.update(quotation, {
      where: { quotation_id: id },
      returning: true, // Trả về bản ghi sau khi cập nhật
    });
  }

  async remove(id: string): Promise<void> {
    const quotation = await this.findOne(id);
    await quotation.destroy();
  }
}
