import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePuntosRecoleccionDto } from './dto/create-puntos-recoleccion.dto';
import { UpdatePuntosRecoleccionDto } from './dto/update-puntos-recoleccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PuntoRecoleccion } from './entities/punto-recoleccion.entity';
import { Repository } from 'typeorm';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Contenedor } from 'src/contenedores/entities/contenedor.entity';


@Injectable()
export class PuntosRecoleccionService {
  constructor(
    @InjectRepository(PuntoRecoleccion)
    private puntosRecoleccionRepository: Repository<PuntoRecoleccion>,
    @InjectRepository(Ruta)
    private rutasRepository: Repository<Ruta>,
    @InjectRepository(Contenedor)
    private contenedoresRepository: Repository<Contenedor>,
  ) {}

  async create(
    createPuntosRecoleccionDto: CreatePuntosRecoleccionDto,
  ): Promise<PuntoRecoleccion> {
    const { ruta_ID, contenedor_ID, ...puntoData } = createPuntosRecoleccionDto;

    const ruta = await this.rutasRepository.findOne({
      where: { ruta_ID },
    });

    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${ruta_ID} no encontrada`);
    }

    const contenedor = await this.contenedoresRepository.findOne({
      where: { contenedor_ID },
      relations: ['puntoRecoleccion'],
    });

    if (!contenedor) {
      throw new NotFoundException(
        `Contenedor con ID ${contenedor_ID} no encontrado`,
      );
    }

    if (contenedor.puntoRecoleccion) {
      throw new ConflictException(
        `El contenedor con ID ${contenedor_ID} ya esta asignado a un punto de recoleccion`,
      );
    }

    const puntoRecoleccion = this.puntosRecoleccionRepository.create({
      ...puntoData,
      ruta,
      contenedor,
    });

    return this.puntosRecoleccionRepository.save(puntoRecoleccion);
  }

  async findAll(): Promise<PuntoRecoleccion[]> {
    return this.puntosRecoleccionRepository.find({
      relations: ['ruta', 'contenedor'],
    });
  }

  async findOne(id: number): Promise<PuntoRecoleccion> {
    const puntoRecoleccion = await this.puntosRecoleccionRepository.findOne({
      where: { punto_ID: id },
      relations: ['ruta', 'contenedor'],
    });

    if (!puntoRecoleccion) {
      throw new NotFoundException(
        `Punto de recoleccion con ID ${id} no encontrado`,
      );
    }

    return puntoRecoleccion;
  }

  async update(
    id: number,
    updatePuntosRecoleccionDto: UpdatePuntosRecoleccionDto,
  ): Promise<PuntoRecoleccion> {
    const puntoRecoleccion = await this.findOne(id);
    const { ruta_ID, contenedor_ID, ...puntoData } = updatePuntosRecoleccionDto;

    if (ruta_ID) {
      const ruta = await this.rutasRepository.findOne({
        where: { ruta_ID },
      });

      if (!ruta) {
        throw new NotFoundException(`Ruta con ID ${ruta_ID} no encontrada`);
      }
      puntoRecoleccion.ruta = ruta;
    }

    if (
      contenedor_ID &&
      contenedor_ID !== puntoRecoleccion.contenedor.contenedor_ID
    ) {
      const contenedor = await this.contenedoresRepository.findOne({
        where: { contenedor_ID },
        relations: ['puntoRecoleccion'],
      });

      if (!contenedor) {
        throw new NotFoundException(
          `Contenedor con ID ${contenedor_ID} no encontrado`,
        );
      }

      if (
        contenedor.puntoRecoleccion &&
        contenedor.puntoRecoleccion.punto_ID !== id
      ) {
        throw new ConflictException(
          `El contenedor con ID ${contenedor_ID} ya esta asignado a un punto de recoleccion`,
        );
      }

      puntoRecoleccion.contenedor = contenedor;
    }

    Object.assign(puntoRecoleccion, puntoData);

    return this.puntosRecoleccionRepository.save(puntoRecoleccion);
  }

  async remove(id: number): Promise<void> {
    const result = await this.puntosRecoleccionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Punto de recoleccion con ID ${id} no encontrado`,
      );
    }
  }
}
