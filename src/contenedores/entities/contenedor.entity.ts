import { ApiTags } from '@nestjs/swagger';
import { PuntoRecoleccion } from 'src/puntos-recoleccion/entities/punto-recoleccion.entity';
import { Recoleccion } from 'src/recolecciones/entities/recoleccion.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags('contenedores')
@Entity('contenedores')
export class Contenedor {
  @PrimaryGeneratedColumn()
  contenedor_ID: number;

  @Column()
  ubicacion: string;

  @Column()
  codigo_QR: string;

  @Column()
  codigo_NFC: string;

  @Column({default: false})
  estadoRecoleccion: boolean;

  @Column({default: 'Contenedor' })
  lugar: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ultima_actualizacion: Date;

  @OneToMany(() => Recoleccion, (recoleccion) => recoleccion.contenedor)
  recolecciones: Recoleccion[];

  @OneToOne(
    () => PuntoRecoleccion,
    (puntoRecoleccion) => puntoRecoleccion.contenedor,
  )
  puntoRecoleccion: PuntoRecoleccion;
}
