import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContenedorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  codigo_QR: string;

  @ApiProperty()
  @IsString()
  codigo_NFC: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lugar: string;
}
