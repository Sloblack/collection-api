import { Module } from '@nestjs/common';
import { RecoleccionesService } from './recolecciones.service';
import { RecoleccionesController } from './recolecciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recoleccion } from './entities/recoleccion.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recoleccion, Usuario, Contenedor])],
  controllers: [RecoleccionesController],
  providers: [RecoleccionesService],
  exports: [RecoleccionesService],
})
export class RecoleccionesModule {}
