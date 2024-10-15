import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { FindProviderStrategy } from './strategies/find-provider/find-provider-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryProviderDto, QueryProviderSchema } from './dtos/QueryProviderDto';
import {
  CreateProviderDto,
  CreateProviderSchema,
} from './dtos/CreateProviderDto';

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
    if (Object.keys(query).length === 0)
      return await this.providerService.findProvider(
        FindProviderStrategy.ALL,
        '',
      );
    const queryFields: { [key: string]: FindProviderStrategy } = {
      all: FindProviderStrategy.ALL,
      name: FindProviderStrategy.NAME,
      phone: FindProviderStrategy.PHONE,
      email: FindProviderStrategy.EMAIL,
      country: FindProviderStrategy.COUNTRY,
      address: FindProviderStrategy.ADDRESS,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
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
    const createRes = await this.providerService.createProvider(body);
    return { message: `Provider created`, data: createRes };
  }

  @Patch(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateProviderSchema.partial())) 
    body: Partial<CreateProviderDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.providerService.updateProvider(id, body);
    return updateResponse;
  }
}

