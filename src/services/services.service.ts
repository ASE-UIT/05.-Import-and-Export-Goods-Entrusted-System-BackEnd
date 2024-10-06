import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';

@Injectable()
export class ServicesService {
  private services = []; // Mảng chứa các dịch vụ (giả định)

  constructor(
    @InjectModel(Service)
    private serviceModel: typeof Service,
  ) {}

  findAll(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await this.serviceModel.findOne({ where: { name } });
    return exists !== null;
  }

  // Tạo service mới
  async create(serviceInfo: CreateServiceDto): Promise<Service> {
    const serviceExists = await this.checkDuplicate(serviceInfo.name);

    if (!serviceExists) {
      return await this.serviceModel.create(serviceInfo);
    } else {
      throw new ConflictException('Service already exists');
    }
  }
  // Lấy service theo tên
  getServiceByName(name: string): Promise<Service> {
    return this.serviceModel.findOne({
      where: {
        name,
      },
    });
  }

  // Lấy service theo short name
  getServiceByShortName(shortName: string): Promise<Service> {
    return this.serviceModel.findOne({
      where: {
        shortName,
      },
    });
  }

  // Lấy service theo fee
  getServiceByFee(fee: number): Promise<Service> {
    return this.serviceModel.findOne({
      where: {
        fee,
      },
    });
  }

  // Cập nhật service theo id
  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const [numberOfAffectedRows, [updatedService]] =
      await this.serviceModel.update(
        {
          name: updateServiceDto.name,
          shortName: updateServiceDto.shortName,
          fee: updateServiceDto.fee,
        },
        {
          where: { serviceId: id },
          returning: true, // Trả về bản ghi đã cập nhật
        },
      );

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return updatedService; // Trả về người dùng đã cập nhật
  }
}
