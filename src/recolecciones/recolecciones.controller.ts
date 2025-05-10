import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecoleccionesService } from './recolecciones.service';
import { CreateRecoleccionDto } from './dto/create-recoleccion.dto';
import { UpdateRecoleccionDto } from './dto/update-recoleccion.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('recolecciones')
export class RecoleccionesController {
  constructor(private readonly recoleccionesService: RecoleccionesService,
  ) {}

  @Post()
  create(@Body() createRecoleccionDto: CreateRecoleccionDto) {
    return this.recoleccionesService.create(createRecoleccionDto);
  }

  @Get()
  findAll() {
    return this.recoleccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recoleccionesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecoleccionDto: UpdateRecoleccionDto,
  ) {
    return this.recoleccionesService.update(+id, updateRecoleccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recoleccionesService.remove(+id);
  }
}