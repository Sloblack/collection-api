import { ApiTags } from '@nestjs/swagger';
import { PuntoRecoleccion } from 'src/puntos-recoleccion/entities/punto-recoleccion.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags('rutas')
@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn()
  ruta_ID: number;

  @Column()
  nombre_ruta: string;

  @Column()
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'time', default: '00:00' })
  hora_actualizacion: string;

  @OneToMany(
    () => PuntoRecoleccion,
    (puntoRecoleccion) => puntoRecoleccion.ruta,
  )
  puntosRecoleccion: PuntoRecoleccion[];

  @ManyToMany(() => Usuario, (usuario) => usuario.rutas)
  usuarios: Usuario[];
}
