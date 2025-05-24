import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRutaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre_ruta: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de actualización debe estar en formato HH:MM (24 horas)',
  })
  hora_actualizacion: string;
}
