import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { SuccessResponse } from '@/shared/classes/success-response.class';

export function createResponseType<T>(
  responseString: string,
  DataType?: Type<T>,
): Type<SuccessResponse<T>> {
  class ResponseType implements SuccessResponse<T> {
    @ApiProperty({ example: responseString })
    message: string;

    @ApiProperty({ type: () => (DataType ? DataType : Object) })
    data: T;

    constructor(message: string, data: T) {
      this.message = message;
      this.data = data;
    }
  }

  Object.defineProperty(ResponseType, 'name', {
    value: `${DataType?.name || 'Empty'}Response`,
  });

  return ResponseType;
}
