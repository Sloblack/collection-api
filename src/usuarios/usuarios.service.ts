import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Not, Repository } from 'typeorm';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Recoleccion } from 'src/recolecciones/entities/recoleccion.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Ruta)
    private rutasRepository: Repository<Ruta>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: id },
      relations: ['recolecciones'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }
  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la contraseña anterior sea correcta
    const isPasswordValid = await usuario.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Cambiar la contraseña
    await usuario.changePassword(newPassword);
    await this.usuariosRepository.save(usuario);
  }

  async assignUserRoute(usuarioId: number, rutaId: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: usuarioId },
      relations: ['rutas'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const ruta = await this.rutasRepository.findOne({
      where: { ruta_ID: rutaId },
    });
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${rutaId} no encontrada`);
    }
    if (!usuario.rutas) {
      usuario.rutas = [];
    }
    usuario.rutas.push(ruta);
    return this.usuariosRepository.save(usuario);
  }
  async unassignUserRoute(usuarioId: number, rutaId: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: usuarioId },
      relations: ['rutas'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const rutaToRemove = usuario.rutas.find((ruta) => ruta.ruta_ID === rutaId);
    if (!rutaToRemove) {
      throw new NotFoundException(`Ruta con ID ${rutaId} no encontrada en el usuario`);
    }

    usuario.rutas = usuario.rutas.filter((ruta) => ruta.ruta_ID!== rutaId);
    return this.usuariosRepository.save(usuario);
  }

  async obtainUserRoutes(usuarioId: number): Promise<Ruta[]> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: usuarioId },
      relations: ['rutas'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }
    return usuario.rutas;
  }

  async obtainUsersRoute(rutaId: number): Promise<Usuario[]> {
    const ruta = await this.rutasRepository.findOne({
      where: { ruta_ID: rutaId },
      relations: ['usuarios'],
    });
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${rutaId} no encontrada`);
    }
    return ruta.usuarios;
  }

  async obtainUserRecollections(usuarioId: number): Promise<Recoleccion[]> {
    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID: usuarioId },
      relations: ['recolecciones', 'recolecciones.usuario', 'recolecciones.contenedor.puntoRecoleccion.ruta'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id: ${usuarioId} no encontrado`)
    }
    return usuario.recolecciones;
  }

  async findByNombre(nombre: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: { nombre }
    });
  }

  async findByTelefono(telefono: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: {telefono}
    });
  }

  async restorePassword(telefono: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { telefono: telefono }
    })
    if (!usuario) {
      throw new NotFoundException(`Usuario con teléfono ${telefono} no encontrado`);
    }
    //const password = 'passw' + usuario.usuario_ID;
    await usuario.changePassword(usuario.telefono);
    await this.usuariosRepository.save(usuario);
    return usuario;
  }
}
