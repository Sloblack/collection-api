import { ApiTags } from '@nestjs/swagger';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags('recolecciones')
@Entity('recolecciones')
export class Recoleccion {
  @PrimaryGeneratedColumn()
  recoleccion_ID: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_recoleccion: Date;

  @Column({
    type: 'enum',
    enum: ['QR', 'NFC'],
  })
  metodo_recoleccion: 'QR' | 'NFC';

  @ManyToOne(() => Usuario, (usuario) => usuario.recolecciones)
  @JoinColumn({ name: 'usuario_ID' })
  usuario: Usuario;

  @ManyToOne(() => Contenedor, (contenedor) => contenedor.recolecciones)
  @JoinColumn({ name: 'contenedor_ID' })
  contenedor: Contenedor;
}
