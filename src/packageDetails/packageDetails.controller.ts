import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PackageDetailsService } from './packageDetails.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreatePackageDetailDto, CreatePackageDetailSchema, UpdatePackageDetailDto } from './dtos/CreatePackageDetailDto';
import { QueryPackageDetailDto, QueryPackageDetailSchema } from './dtos/QueryPackageDetailDto';
import { FindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.enum';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { PackageType } from './models/packageDetails.model';

@ApiTags('package details')
@Controller({
    path: 'package-details',
    version: '1',
})
export class PackageDetailsController {
    constructor(
        private packageDetailsService: PackageDetailsService
    ) { }

    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @Get()
    @ApiOperation({ summary: 'Retrieve package detail based on query parameters' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved quote requests' })
    @ApiResponse({ status: 404, description: 'No package detail found' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiQuery({ name: 'packageType', required: false, enum: PackageType })
    @ApiQuery({ name: 'detailId', required: false, type: String })
    async getQuoteReqDetail(
        @Query(new ZodValidationPipe(QueryPackageDetailSchema)) query: QueryPackageDetailDto
    ) {
        if (Object.keys(query).length === 0)
            return await this.packageDetailsService.findPackageDetail(
                FindPackageDetailStrategy.ALL,
                '',
            );

        const queryFields: { [key: string]: FindPackageDetailStrategy } = {
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
        throw new NotFoundException('Package detail not found')
    }

    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @Post()
    @ApiOperation({ summary: 'Create a new package detail' })
    @ApiResponse({ status: 201, description: 'Package detail successfully created' })
    @ApiResponse({ status: 201, description: 'Quote request successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid foreign key.' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiBody({
        type: CreatePackageDetailDto,
        schema: {
            example: {
                packageType: "DRY",
                weight: 10,
                length: 10,
                width: 10,
                height: 10,
                detailId: "b1c27e61-77f1-4d5a-a10d-a28a5c8b1ce1"
            },
        },
    })
    async createPackageDetail(
        @Body(new ZodValidationPipe(CreatePackageDetailSchema)) body: CreatePackageDetailDto
    ) {
        const packageDetail = await this.packageDetailsService.createPackageDetail(body)
        return { message: "Package Detail Created", data: packageDetail }
    }

    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @Patch(':id')
    @ApiOperation({ summary: 'Update a package detail' })
    @ApiResponse({ status: 200, description: 'Package detail successfully updated' })
    @ApiResponse({ status: 400, description: 'Invalid foreign key' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 404, description: "Quote request detail id does not exists in database" })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiBody({
        type: UpdatePackageDetailDto,
        schema: {
            example: {
                packageType: "DRY",
                weight: 10,
                length: 10,
                width: 10,
                height: 10,
                detailId: "b1c27e61-77f1-4d5a-a10d-a28a5c8b1ce1"
            },
        },
    })
    async updatePackageDetail(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(CreatePackageDetailSchema.partial())) body: Partial<CreatePackageDetailDto>) {
        //check if body is empty 
        if (Object.keys(body).length === 0) {
            throw new BadRequestException('Body cannot be empty')
        }
        const packageDetail = await this.packageDetailsService.updatePackageDetail(id, body)
        return { message: 'Package Detail updated successfully', data: packageDetail }
    }
}
