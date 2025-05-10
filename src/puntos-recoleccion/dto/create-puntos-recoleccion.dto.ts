import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePuntosRecoleccionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ruta_ID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contenedor_ID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  orden: number;
}
