import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private rutasRepository: Repository<Ruta>,
  ) {}
  async create(createRutaDto: CreateRutaDto): Promise<Ruta> {
    const ruta = this.rutasRepository.create(createRutaDto);
    return this.rutasRepository.save(ruta);
  }

  async findAll(): Promise<Ruta[]> {
    return this.rutasRepository.find({
      relations: ['puntosRecoleccion', 'puntosRecoleccion.contenedor'],
    });
  }

  async findOne(id: number): Promise<Ruta> {
    const ruta = await this.rutasRepository.findOne({
      where: { ruta_ID: id },
      relations: ['puntosRecoleccion', 'puntosRecoleccion.contenedor'],
    });
    if (!ruta) {
      throw new NotFoundException(`Ruta con id ${id} no encontrada`);
    }
    return ruta;
  }

  async update(id: number, updateRutaDto: UpdateRutaDto): Promise<Ruta> {
    const ruta = await this.findOne(id);
    Object.assign(ruta, updateRutaDto);
    return this.rutasRepository.save(ruta);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rutasRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }
  }
}
