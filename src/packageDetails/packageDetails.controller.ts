import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PackageDetailsService } from './packageDetails.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreatePackageDetailDto, CreatePackageDetailSchema } from './dtos/CreatePackageDetailDto';
import { UpdatePackageDetailDto, UpdatePackageDetailSchema } from './dtos/UpdatePackageDetailDto';
import { QueryPackageDetailDto, QueryPackageDetailSchema } from './dtos/QueryPackageDetailDto';
import { FindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('package details')
@Controller({
    path: 'package-details',
    version: '1',
})
export class PackageDetailsController {
    constructor(
        private packageDetailsService: PackageDetailsService
    ) { }

    @Get()
    async getQuoteReqDetail(
        @Query(new ZodValidationPipe(QueryPackageDetailSchema)) query: QueryPackageDetailDto
    ) {
        const queryFields: { [key: string]: FindPackageDetailStrategy } = {
            all: FindPackageDetailStrategy.ALL,
            detailId: FindPackageDetailStrategy.DETAILID,
            packageType: FindPackageDetailStrategy.PACKAGETYPE
        }

        // Assign corrisponding strategy to query fields
        for (const [key, strategy] of Object.entries(queryFields)) {
            const value = query[key as keyof QueryPackageDetailDto];
            if (value) {
                const packageDetail = await this.packageDetailsService.findPackageDetail(
                    strategy,
                    value,
                );
                if (packageDetail.length > 0) {
                    if (strategy === FindPackageDetailStrategy.ALL || packageDetail.length > 1)
                        return packageDetail;
                    else return packageDetail[0];
                }
            }
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create a new package detail' })
    @ApiResponse({ status: 201, description: 'Package detail successfully created' })
    async createPackageDetail(
        @Body(new ZodValidationPipe(CreatePackageDetailSchema)) body: CreatePackageDetailDto
    ) {
        const packageDetail = await this.packageDetailsService.createPackageDetail(body)
        return { message: "Package Detail Created", data: packageDetail }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a package detail' })
    @ApiResponse({ status: 200, description: 'Package detail successfully updated' })
    async updatePackageDetail(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(CreatePackageDetailSchema.partial())) body: Partial<CreatePackageDetailDto>) {
        //check if body is empty 
        if (Object.keys(body).length === 0) {
            throw new BadRequestException('Body cannot be empty')
        }
        return await this.packageDetailsService.updatePackageDetail(id, body)
    }
}
