import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRecoleccionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['QR', 'NFC'])
  metodo_recoleccion: 'QR' | 'NFC';

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  usuario_ID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contenedor_ID: number;
}
