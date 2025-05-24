import { Module } from '@nestjs/common';
import { ContenedoresService } from './contenedores.service';
import { ContenedoresController } from './contenedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contenedor } from './entities/contenedor.entity';
import { Ruta } from 'src/rutas/entities/ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contenedor, Ruta])],
  controllers: [ContenedoresController],
  providers: [ContenedoresService],
  exports: [ContenedoresService],
})
export class ContenedoresModule {}
