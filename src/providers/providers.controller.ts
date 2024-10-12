import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { FindProviderStrategy } from './strategies/find-provider/find-provider-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryProviderDto, QueryProviderSchema } from './dtos/QueryProviderDto';
import {
  CreateProviderDto,
  CreateProviderSchema,
} from './dtos/CreateProviderDto';
import {
  UpdateProviderDto,
  UpdateProviderSchema,
} from './dtos/UpdateProviderDto';

@Controller({
  path: 'providers',
  version: '1',
})
export class ProvidersController {
  constructor(private providerService: ProvidersService) {}

  @Get()
  async getProviders(
    @Query(new ZodValidationPipe(QueryProviderSchema)) query: QueryProviderDto,
  ) {
    const queryFields: { [key: string]: FindProviderStrategy } = {
      all: FindProviderStrategy.ALL,
      name: FindProviderStrategy.NAME,
      phone: FindProviderStrategy.PHONE,
      email: FindProviderStrategy.EMAIL,
      country: FindProviderStrategy.COUNTRY,
      address: FindProviderStrategy.ADDRESS,
    };
    if (Object.keys(query).length === 0) {
      throw new BadRequestException('Query cannot be empty');
    }

    for (const [key, strategy] of Object.entries(queryFields)) {
      if (!(key in query)) {
        throw new BadRequestException(`Invalid query parameter: ${key}`);
      }
      
      const value = query[key as keyof QueryProviderDto];
      if (value) {
        const provider = await this.providerService.findProvider(strategy, value);
        if (provider.length > 0) {
          if (strategy === FindProviderStrategy.ALL || provider.length > 1)
            return provider;
          else return provider[0];
        }
      }
    }

    throw new NotFoundException('Provider not found');
  }

  @Post()
  async createProvider(
    @Body(new ZodValidationPipe(CreateProviderSchema)) body: CreateProviderDto,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Data cannot be empty');
    }

    const hasNonEmptyField = Object.values(body).some((value) => value !== null && value !== '');
    if (!hasNonEmptyField) {
      throw new BadRequestException('At least one field must be provided');
    }
    
    await this.providerService.createProvider(body);
    return { message: `Provider created` };
  }

  @Patch(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProviderSchema.partial())) body: Partial<UpdateProviderDto>,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Data cannot be empty');
    }

    const hasNonEmptyField = Object.values(body).some((value) => value !== null && value !== '');
    if (!hasNonEmptyField) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    const updatedProvider = await this.providerService.updateProvider(id, body);
    return {
      message: 'Provider updated successfully',
      data: updatedProvider,
    };
  }
}

