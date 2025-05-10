import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecoleccionDto } from './dto/create-recoleccion.dto';
import { UpdateRecoleccionDto } from './dto/update-recoleccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recoleccion } from './entities/recoleccion.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';

@Injectable()
export class RecoleccionesService {
  constructor(
    @InjectRepository(Recoleccion)
    private recoleccionesRepository: Repository<Recoleccion>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Contenedor)
    private contenedoresRepository: Repository<Contenedor>,
  ) {}

  async create(
    createRecoleccionDto: CreateRecoleccionDto,
  ): Promise<Recoleccion> {
    const { usuario_ID, contenedor_ID, ...recoleccionData } =
      createRecoleccionDto;

    const usuario = await this.usuariosRepository.findOne({
      where: { usuario_ID },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuario_ID} no encontrado`);
    }

    const contenedor = await this.contenedoresRepository.findOne({
      where: { contenedor_ID },
    });
    if (!contenedor) {
      throw new NotFoundException(
        `Contenedor con ID ${contenedor_ID} no encontrado`,
      );
    }

    const recoleccion = this.recoleccionesRepository.create({
      ...recoleccionData,
      usuario,
      contenedor,
    });

    return this.recoleccionesRepository.save(recoleccion);
  }

  async findAll(): Promise<Recoleccion[]> {
    return this.recoleccionesRepository.find({
      relations: ['usuario', 'contenedor', 'contenedor.puntoRecoleccion.ruta'],
    });
  }

  async findOne(id: number): Promise<Recoleccion> {
    const recoleccion = await this.recoleccionesRepository.findOne({
      where: { recoleccion_ID: id },
      relations: ['usuario', 'contenedor', 'contenedor.puntoRecoleccion.ruta'],
    });

    if (!recoleccion) {
      throw new NotFoundException(`Recoleccion con ID ${id} no encontrada`);
    }

    return recoleccion;
  }

  async update(
    id: number,
    updateRecoleccionDto: UpdateRecoleccionDto,
  ): Promise<Recoleccion> {
    const recoleccion = await this.findOne(id);
    const { usuario_ID, contenedor_ID, ...recoleccionData } =
      updateRecoleccionDto;

    if (usuario_ID) {
      const usuario = await this.usuariosRepository.findOne({
        where: { usuario_ID },
      });
      if (!usuario) {
        throw new NotFoundException(
          `Usuario con ID ${usuario_ID} no encontrado`,
        );
      }
      recoleccion.usuario = usuario;
    }

    if (contenedor_ID) {
      const contenedor = await this.contenedoresRepository.findOne({
        where: { contenedor_ID },
      });
      if (!contenedor) {
        throw new NotFoundException(
          `Contenedor con ID ${contenedor_ID} no encontrado`,
        );
      }
      recoleccion.contenedor = contenedor;
    }

    Object.assign(recoleccion, recoleccionData);
    return this.recoleccionesRepository.save(recoleccion);
  }

  async remove(id: number): Promise<void> {
    const result = await this.recoleccionesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Recolección con ID ${id} no encontrada`);
    }
  }
}
