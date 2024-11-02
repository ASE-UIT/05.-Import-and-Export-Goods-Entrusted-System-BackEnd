import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ example: 'Action successful' })
  message: string;

  @ApiProperty()
  data: T;

  constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
  }
}
