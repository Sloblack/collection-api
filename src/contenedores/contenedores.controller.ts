import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ContenedoresService } from './contenedores.service';
import { CreateContenedorDto } from './dto/create-contenedor.dto';
import { UpdateContenedorDto } from './dto/update-contenedor.dto';
import { Contenedor } from './entities/contenedor.entity';

@Controller('contenedores')
export class ContenedoresController {
  constructor(private readonly contenedoresService: ContenedoresService) {}

  @Post()
  create(@Body() createContenedorDto: CreateContenedorDto) {
    return this.contenedoresService.create(createContenedorDto);
  }

  @Get()
  findAll() {
    return this.contenedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contenedoresService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContenedorDto: UpdateContenedorDto,
  ) {
    return this.contenedoresService.update(+id, updateContenedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenedoresService.remove(+id);
  }

  @Get(':codigo/contenedor')
  async findByCode(@Param('codigo') codigo: string) {
    return this.contenedoresService.findContenedor(codigo);
  }

  @Patch(':id/estado-recoleccion')
  async actualizarEstadoRecoleccion(@Param('id') id: number, @Query('estadoRecoleccion') estadoRecoleccion: boolean) {
    return this.contenedoresService.actualizarEstadoContenedor(id, estadoRecoleccion);
  }

}
