import { PartialType } from '@nestjs/mapped-types';
import { CreateContenedorDto } from './create-contenedor.dto';

export class UpdateContenedorDto extends PartialType(CreateContenedorDto) {}
