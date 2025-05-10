import { ApiTags } from '@nestjs/swagger';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags('puntos_recoleccion')
@Entity('puntos_recoleccion')
export class PuntoRecoleccion {
  @PrimaryGeneratedColumn()
  punto_ID: number;

  @ManyToOne(() => Ruta, (ruta) => ruta.puntosRecoleccion)
  @JoinColumn({ name: 'ruta_ID' })
  ruta: Ruta;

  @OneToOne(() => Contenedor, (contenedor) => contenedor.puntoRecoleccion)
  @JoinColumn({ name: 'contenedor_ID' })
  contenedor: Contenedor;

  @Column()
  orden: number;
}
