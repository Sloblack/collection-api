import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateRutaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre_ruta: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
