import { Exclude } from 'class-transformer';
import { Recoleccion } from 'src/recolecciones/entities/recoleccion.entity';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { truncate } from 'fs';

@ApiTags('usuarios')
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  usuario_ID: number;

  @Column()
  nombre: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  contrasenia: string;

  @Column({unique:true})
  telefono: string;

  @Column({
    type: 'enum',
    enum: ['recolector', 'administrador'],
  })
  rol: 'recolector' | 'administrador';

  @OneToMany(() => Recoleccion, (recoleccion) => recoleccion.usuario)
  recolecciones: Recoleccion[];

  @ManyToMany(() => Ruta, (ruta) => ruta.usuarios)
  @JoinTable({
    name: 'usuario_rutas',
    joinColumn: {
      name: 'usuario_ID',
      referencedColumnName: 'usuario_ID',
    },
    inverseJoinColumn: {
      name: 'ruta_ID',
      referencedColumnName: 'ruta_ID',
    },
  })
  rutas: Ruta[];

  @Exclude()
  private skipHashPassword: boolean = false;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.skipHashPassword && this.contrasenia) {
      const salt = await bcrypt.genSalt();
      this.contrasenia = await bcrypt.hash(this.contrasenia, salt);
    }
    this.skipHashPassword = true;
  }
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.contrasenia);
  }
  async changePassword(newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.contrasenia = await bcrypt.hash(newPassword, salt);

    this.skipHashPassword = true;
  }
}
