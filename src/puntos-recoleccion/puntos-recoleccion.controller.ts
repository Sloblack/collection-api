import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PuntosRecoleccionService } from './puntos-recoleccion.service';
import { CreatePuntosRecoleccionDto } from './dto/create-puntos-recoleccion.dto';
import { UpdatePuntosRecoleccionDto } from './dto/update-puntos-recoleccion.dto';

@Controller('puntos-recoleccion')
export class PuntosRecoleccionController {
  constructor(
    private readonly puntosRecoleccionService: PuntosRecoleccionService,
  ) {}

  @Post()
  create(@Body() createPuntosRecoleccionDto: CreatePuntosRecoleccionDto) {
    return this.puntosRecoleccionService.create(createPuntosRecoleccionDto);
  }

  @Get()
  findAll() {
    return this.puntosRecoleccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosRecoleccionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePuntosRecoleccionDto: UpdatePuntosRecoleccionDto,
  ) {
    return this.puntosRecoleccionService.update(
      +id,
      updatePuntosRecoleccionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntosRecoleccionService.remove(+id);
  }
}
