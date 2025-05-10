import { PartialType } from '@nestjs/mapped-types';
import { CreateRecoleccionDto } from './create-recoleccion.dto';

export class UpdateRecoleccionDto extends PartialType(CreateRecoleccionDto) {}
