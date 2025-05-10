import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntosRecoleccionDto } from './create-puntos-recoleccion.dto';

export class UpdatePuntosRecoleccionDto extends PartialType(
  CreatePuntosRecoleccionDto,
) {}
