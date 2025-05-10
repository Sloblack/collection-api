import { Module } from '@nestjs/common';
import { PuntosRecoleccionService } from './puntos-recoleccion.service';
import { PuntosRecoleccionController } from './puntos-recoleccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntoRecoleccion } from './entities/punto-recoleccion.entity';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PuntoRecoleccion, Ruta, Contenedor])],
  controllers: [PuntosRecoleccionController],
  providers: [PuntosRecoleccionService],
  exports: [PuntosRecoleccionService],
})
export class PuntosRecoleccionModule {}
