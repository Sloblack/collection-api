
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { format, toZonedTime } from 'date-fns-tz';

export class CreateRecoleccionDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date) // Asegura que se convierta a Date durante la validación
  @Transform(({ value }) => {
    // Para entrada: convierte string a Date si es necesario
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }, { toClassOnly: true })
  @Transform(({ value }) => {
    // Para salida: convierte Date a string en zona horaria local
    if (value instanceof Date) {
      const zonedDate = toZonedTime(value, 'America/Mexico_City');
      return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS", {
        timeZone: 'America/Mexico_City',
      });
    }
    return value;
  }, { toPlainOnly: true })
  fecha_recoleccion: Date;

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
